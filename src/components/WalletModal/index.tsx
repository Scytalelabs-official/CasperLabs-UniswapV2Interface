import { Trans } from '@lingui/macro'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core'
import { Signer } from 'casper-js-sdk'
import { AutoColumn } from 'components/Column'
import { PrivacyPolicy } from 'components/PrivacyPolicy'
import Row, { AutoRow, RowBetween } from 'components/Row'
import { useWalletConnectMonitoringEventCallback } from 'hooks/useMonitoringEventCallback'
import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Info } from 'react-feather'
import ReactGA from 'react-ga'
import styled from 'styled-components/macro'

import MetamaskIcon from '../../assets/images/cspr.png'
import SignerIcon from '../../assets/images/cspr.png'
import { ReactComponent as Close } from '../../assets/images/x.svg'
import { fortmatic, injected, portis } from '../../connectors'
import { OVERLAY_READY } from '../../connectors/Fortmatic'
import { SUPPORTED_WALLETS } from '../../constants/wallet'
import usePrevious from '../../hooks/usePrevious'
import { useModalOpen, useWalletModalToggle } from '../../state/application/hooks'
import { ApplicationModal } from '../../state/application/reducer'
import { ExternalLink, TYPE } from '../../theme'
import { isMobile } from '../../utils/userAgent'
import AccountDetails from '../AccountDetails'
import Card, { LightCard } from '../Card'
import Modal from '../Modal'
import Option from './Option'
import PendingView from './PendingView'

const CloseIcon = styled.div`
  position: absolute;
  right: 1rem;
  top: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
`

const CloseColor = styled(Close)`
  path {
    stroke: ${({ theme }) => theme.text4};
  }
`

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  margin: 0;
  padding: 0;
  width: 100%;
`

const HeaderRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap};
  padding: 1rem 1rem;
  font-weight: 500;
  color: ${(props) => (props.color === 'blue' ? ({ theme }) => theme.primary1 : 'inherit')};
  ${({ theme }) => theme.mediaWidth.upToMedium`
    padding: 1rem;
  `};
`

const ContentWrapper = styled.div`
  background-color: ${({ theme }) => theme.bg0};
  padding: 0 1rem 1rem 1rem;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  ${({ theme }) => theme.mediaWidth.upToMedium`padding: 0 1rem 1rem 1rem`};
`

const UpperSection = styled.div`
  position: relative;

  h5 {
    margin: 0;
    margin-bottom: 0.5rem;
    font-size: 1rem;
    font-weight: 400;
  }

  h5:last-child {
    margin-bottom: 0px;
  }

  h4 {
    margin-top: 0;
    font-weight: 500;
  }
`

const OptionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    grid-template-columns: 1fr;
    grid-gap: 10px;
  `};
`

const HoverText = styled.div`
  text-decoration: none;
  color: ${({ theme }) => theme.text1};
  display: flex;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`

const LinkCard = styled(Card)`
  background-color: ${({ theme }) => theme.primary1};
  color: ${({ theme }) => theme.white};

  :hover {
    cursor: pointer;
    filter: brightness(0.9);
  }
`

const WALLET_VIEWS = {
  OPTIONS: 'options',
  OPTIONS_SECONDARY: 'options_secondary',
  ACCOUNT: 'account',
  PENDING: 'pending',
  LEGAL: 'legal',
  LOCKED: 'locked',
  UNLOCKED: 'unlocked',
}

export default function WalletModal({
  pendingTransactions,
  confirmedTransactions,
  ENSName,
}: {
  pendingTransactions: string[] // hashes of pending
  confirmedTransactions: string[] // hashes of confirmed
  ENSName?: string
}) {
  // important that these are destructed from the account-specific web3-react context
  const { active, connector, activate, error } = useWeb3React()
  const account = localStorage.getItem('account')

  const [walletView, setWalletView] = useState(WALLET_VIEWS.ACCOUNT)
  const previousWalletView = usePrevious(walletView)

  const [isConnected, setIsConncectd] = useState(false)
  const [isLocked, setIsLocked] = useState(true)
  const [activeKey, setActiveKey] = useState('')

  const [pendingWallet, setPendingWallet] = useState<AbstractConnector | undefined>()

  const [pendingError, setPendingError] = useState<boolean>()

  const walletModalOpen = useModalOpen(ApplicationModal.WALLET)
  const toggleWalletModal = useWalletModalToggle()

  const previousAccount = usePrevious(account)

  const logMonitoringEvent = useWalletConnectMonitoringEventCallback()

  const connectionChecker = async () => {
    const publicKey = await Signer.getActivePublicKey()
    console.log('publicKey', publicKey)
    localStorage.setItem('account', publicKey)
    console.log('foran', localStorage.getItem('account'))
    logMonitoringEvent({ publicKey })
    setActiveKey(publicKey)
    setWalletView(WALLET_VIEWS.ACCOUNT)
  }

  // close on connection, when logged out before
  useEffect(() => {
    if (account !== null && account !== 'null' && account !== undefined && !previousAccount && walletModalOpen) {
      toggleWalletModal()
    }
  }, [account, previousAccount, toggleWalletModal, walletModalOpen])

  useEffect(() => {
    if (isConnected && !isLocked) {
      connectionChecker()
    }
  }, [isConnected, isLocked, connectionChecker])

  // always reset to account view
  useEffect(() => {
    if (walletModalOpen) {
      setPendingError(false)
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
  }, [walletModalOpen])
  // close modal when a connection is successful
  const activePrevious = usePrevious(active)
  useEffect(() => {
    if (walletModalOpen && active && !activePrevious) {
      setWalletView(WALLET_VIEWS.ACCOUNT)
    }
    window.addEventListener('signer:connected', (msg: any) => {
      console.log('Initial State: ', msg)
      setIsConncectd(true)
      setIsLocked(!msg.detail.isUnlocked)
      setActiveKey(msg.detail.activeKey)
      localStorage.setItem('account', msg.detail.activeKey)
    })
    window.addEventListener('signer:disconnected', (msg: any) => {
      console.log('Initial State: ', msg)
      setIsConncectd(msg.detail.isConnected)
      setIsLocked(!msg.detail.isUnlocked)
      setActiveKey(msg.detail.activeKey)
      localStorage.setItem('account', msg.detail.activeKey)
    })
    window.addEventListener('signer:tabUpdated', (msg: any) => {
      console.log('Initial State: ', msg)
      setIsConncectd(msg.detail.isConnected)
      setIsLocked(!msg.detail.isUnlocked)
      setActiveKey(msg.detail.activeKey)
      localStorage.setItem('account', msg.detail.activeKey)
    })
    window.addEventListener('signer:activeKeyChanged', (msg: any) => {
      console.log('Initial State: ', msg)
      setActiveKey(msg.detail.activeKey)
      localStorage.setItem('account', msg.detail.activeKey)
    })
    window.addEventListener('signer:locked', (msg: any) => {
      console.log('Initial State: ', msg)
      setActiveKey(msg.detail.activeKey)
      setIsLocked(!msg.detail.isUnlocked)
      localStorage.setItem('account', msg.detail.activeKey)
    })
    window.addEventListener('signer:unlocked', (msg: any) => {
      console.log('Initial State: ', msg)
      setIsConncectd(msg.detail.isConnected)
      setIsLocked(!msg.detail.isUnlocked)
      setActiveKey(msg.detail.activeKey)
      localStorage.setItem('account', msg.detail.activeKey)
    })
    window.addEventListener('signer:initialState', (msg: any) => {
      console.log('Initial State: ', msg)
      setIsConncectd(msg.detail.isConnected)
      setIsLocked(!msg.detail.isUnlocked)
      setActiveKey(msg.detail.activeKey)
      localStorage.setItem('account', msg.detail.activeKey)
    })
  }, [setWalletView, active, error, walletModalOpen, activePrevious])

  const tryActivation = async () => {
    let name = ''
    Object.keys(SUPPORTED_WALLETS).map((key) => {
      if ('CasperSigner' === SUPPORTED_WALLETS[key].name) {
        return (name = SUPPORTED_WALLETS[key].name)
      }
      return true
    })
    // log selected wallet
    ReactGA.event({
      category: 'Wallet',
      action: 'Change Wallet',
      label: name,
    })
    setWalletView(WALLET_VIEWS.PENDING)
    const data = await Signer.sendConnectionRequest()
    console.log('data', data)
    // const isConnected = await Signer.isConnected()
    console.log('isConnected', isConnected)
  }

  // close wallet modal if fortmatic modal is active
  useEffect(() => {
    fortmatic.on(OVERLAY_READY, () => {
      toggleWalletModal()
    })
  }, [toggleWalletModal])

  // get wallets user can switch too, depending on device/browser
  function getOptions() {
    const isMetamask = window.ethereum && window.ethereum.isMetaMask
    return Object.keys(SUPPORTED_WALLETS).map((key) => {
      const option = SUPPORTED_WALLETS[key]
      console.log('option', option)
      console.log('isMetamask', isMetamask)
      // check for mobile options
      if (isMobile) {
        //disable portis on mobile for now
        if (option.connector === portis) {
          return null
        }

        if (!window.web3 && !window.ethereum && option.mobile) {
          return (
            <Option
              onClick={() => {
                option.connector !== connector && !option.href && tryActivation()
              }}
              id={`connect-${key}`}
              key={key}
              color={option.color}
              link={option.href}
              header={option.name}
              subheader={null}
              icon={option.iconURL}
            />
          )
        }
        return null
      }

      // overwrite injected when needed
      if (option.connector === injected) {
        // don't show injected if there's no injected provider
        if (!(window.web3 || window.ethereum)) {
          if (option.name === 'MetaMask') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={<Trans>Install Metamask</Trans>}
                subheader={null}
                link={'https://metamask.io/'}
                icon={MetamaskIcon}
              />
            )
          } else if (option.name === 'CasperSigner') {
            return (
              <Option
                id={`connect-${key}`}
                key={key}
                color={'#E8831D'}
                header={<Trans>Install Signer</Trans>}
                subheader={null}
                link={'https://metamask.io/'}
                icon={SignerIcon}
              />
            )
          } else {
            return null //dont want to return install twice
          }
        }
        // don't return metamask if injected provider isn't metamask
        else if (option.name === 'MetaMask' && !isMetamask) {
          return null
        }
        // likewise for generic
        else if (option.name === 'Injected' && isMetamask) {
          return null
        }
        // likewise for CasperSigner
        else if (option.name === 'CasperSigner' && isMetamask) {
          return null
        }
      } else if (option.name === 'CasperSigner') {
        return (
          <Option
            onClick={() => {
              tryActivation()
            }}
            id={`connect-${key}`}
            key={key}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null}
            icon={option.iconURL}
          />
        )
      }

      // return rest of options
      return (
        !isMobile &&
        !option.mobileOnly && (
          <Option
            id={`connect-${key}`}
            onClick={() => {
              option.connector === connector ? setWalletView(WALLET_VIEWS.ACCOUNT) : !option.href && tryActivation()
            }}
            key={key}
            active={option.connector === connector}
            color={option.color}
            link={option.href}
            header={option.name}
            subheader={null} //use option.descriptio to bring back multi-line
            icon={option.iconURL}
          />
        )
      )
    })
  }

  function getModalContent() {
    if (error) {
      return (
        <UpperSection>
          <CloseIcon onClick={toggleWalletModal}>
            <CloseColor />
          </CloseIcon>
          <HeaderRow>
            {error instanceof UnsupportedChainIdError ? <Trans>Wrong Network</Trans> : <Trans>Error connecting</Trans>}
          </HeaderRow>
          <ContentWrapper>
            {error instanceof UnsupportedChainIdError ? (
              <h5>
                <Trans>Please connect to the appropriate Ethereum network.</Trans>
              </h5>
            ) : (
              <Trans>Error connecting. Try refreshing the page.</Trans>
            )}
          </ContentWrapper>
        </UpperSection>
      )
    }
    if (walletView === WALLET_VIEWS.LEGAL) {
      return (
        <UpperSection>
          <HeaderRow>
            <HoverText
              onClick={() => {
                setWalletView(
                  (previousWalletView === WALLET_VIEWS.LEGAL ? WALLET_VIEWS.ACCOUNT : previousWalletView) ??
                    WALLET_VIEWS.ACCOUNT
                )
              }}
            >
              <ArrowLeft />
            </HoverText>
            <Row justify="center">
              <TYPE.mediumHeader>
                <Trans>Legal & Privacy</Trans>
              </TYPE.mediumHeader>
            </Row>
          </HeaderRow>
          <PrivacyPolicy />
        </UpperSection>
      )
    }
    if (account !== null && account !== 'null' && account !== undefined && walletView === WALLET_VIEWS.ACCOUNT) {
      return (
        <AccountDetails
          toggleWalletModal={toggleWalletModal}
          pendingTransactions={pendingTransactions}
          confirmedTransactions={confirmedTransactions}
          ENSName={ENSName}
          openOptions={() => setWalletView(WALLET_VIEWS.OPTIONS)}
        />
      )
    }
    return (
      <UpperSection>
        <CloseIcon onClick={toggleWalletModal}>
          <CloseColor />
        </CloseIcon>
        {walletView !== WALLET_VIEWS.ACCOUNT ? (
          <HeaderRow color="blue">
            <HoverText
              onClick={() => {
                setPendingError(false)
                setWalletView(WALLET_VIEWS.ACCOUNT)
              }}
            >
              <ArrowLeft />
            </HoverText>
          </HeaderRow>
        ) : (
          <HeaderRow>
            <HoverText>
              <Trans>Connect a wallete</Trans>
            </HoverText>
          </HeaderRow>
        )}

        <ContentWrapper>
          <AutoColumn gap="16px">
            <LightCard>
              <AutoRow style={{ flexWrap: 'nowrap' }}>
                <TYPE.black fontSize={14}>
                  <Trans>
                    By connecting a wallet, you agree to Casperswap Labs’{' '}
                    <ExternalLink href="https://uniswap.org/terms-of-service/">Terms of Service</ExternalLink> and
                    acknowledge that you have read and understand the Casperswap{' '}
                    <ExternalLink href="https://uniswap.org/disclaimer/">Protocol Disclaimer</ExternalLink>.
                  </Trans>
                </TYPE.black>
              </AutoRow>
            </LightCard>
            <LinkCard padding=".5rem" $borderRadius=".75rem" onClick={() => setWalletView(WALLET_VIEWS.LEGAL)}>
              <RowBetween>
                <AutoRow gap="4px">
                  <Info size={20} />
                  <TYPE.white fontSize={14}>
                    <Trans>How this app uses APIs</Trans>
                  </TYPE.white>
                </AutoRow>
                <ArrowRight size={16} />
              </RowBetween>
            </LinkCard>
            {walletView === WALLET_VIEWS.PENDING ? (
              <PendingView
                connector={pendingWallet}
                error={pendingError}
                setPendingError={setPendingError}
                tryActivation={tryActivation}
              />
            ) : (
              <OptionGrid>{getOptions()}</OptionGrid>
            )}
          </AutoColumn>
        </ContentWrapper>
      </UpperSection>
    )
  }

  return (
    <Modal isOpen={walletModalOpen} onDismiss={toggleWalletModal} minHeight={false} maxHeight={90}>
      <Wrapper>{getModalContent()}</Wrapper>
    </Modal>
  )
}
