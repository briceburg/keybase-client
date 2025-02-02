import * as C from '@/constants'
import * as Kb from '@/common-adapters'
import * as React from 'react'
import {SignupScreen, errorBanner} from '../signup/common'
import {isMobile} from '@/constants/platform'

const Container = () => {
  const error = C.useProvisionState(s => s.error)
  const hint = C.useProvisionState(s => `${s.codePageOtherDevice.name || ''}...`)
  const waiting = C.useAnyWaiting(C.provisionWaitingKey)
  const navigateUp = C.useRouterState(s => s.dispatch.navigateUp)
  const onBack = () => {
    navigateUp()
  }
  const onSubmit = C.useProvisionState(s => s.dispatch.dynamic.setPassphrase)
  const props = {
    error: error,
    hint: hint,
    onBack: onBack,
    onSubmit: (paperkey: string) => !waiting && onSubmit?.(paperkey),
    waiting: waiting,
  }
  return <PaperKey {...props} />
}

type Props = {
  onBack?: () => void
  onSubmit: (paperKey: string) => void
  hint: string
  error: string
  waiting: boolean
}

export class PaperKey extends React.Component<Props, {paperKey: string}> {
  state = {paperKey: ''}
  _onSubmit = () => this.props.onSubmit(this.state.paperKey)

  render() {
    const props = this.props

    return (
      <SignupScreen
        banners={errorBanner(props.error)}
        buttons={[
          {
            disabled: !this.state.paperKey,
            label: 'Continue',
            onClick: this._onSubmit,
            type: 'Success',
            waiting: props.waiting,
          },
        ]}
        noBackground={true}
        onBack={this.props.onBack}
        title={isMobile ? 'Enter paper key' : 'Enter your paper key'}
      >
        <Kb.Box2
          direction="vertical"
          style={styles.contents}
          centerChildren={!Kb.Styles.isAndroid /* android keyboardAvoiding doesnt work well */}
          gap={Kb.Styles.isMobile ? 'tiny' : 'medium'}
        >
          <Kb.Box2 direction="vertical" gap="tiny" centerChildren={true} gapEnd={true}>
            <Kb.Icon type="icon-paper-key-64" />
            <Kb.Text type="Header">{props.hint}</Kb.Text>
          </Kb.Box2>
          <Kb.Box2 direction="vertical" style={styles.inputContainer}>
            <Kb.PlainInput
              autoFocus={true}
              multiline={true}
              rowsMax={3}
              placeholder="Type in your entire paper key"
              textType="Body"
              style={styles.input}
              onEnterKeyDown={this._onSubmit}
              onChangeText={paperKey => this.setState({paperKey})}
              value={this.state.paperKey}
            />
          </Kb.Box2>
        </Kb.Box2>
      </SignupScreen>
    )
  }
}

const styles = Kb.Styles.styleSheetCreate(
  () =>
    ({
      backButton: Kb.Styles.platformStyles({
        isElectron: {
          marginLeft: Kb.Styles.globalMargins.medium,
          marginTop: Kb.Styles.globalMargins.medium,
        },
        isMobile: {
          marginLeft: 0,
          marginTop: 0,
        },
      }),
      contents: Kb.Styles.platformStyles({
        common: {
          flexGrow: 1,
          width: '100%',
        },
        isElectron: {maxWidth: 460},
        isMobile: {maxWidth: 300},
        isTablet: {maxWidth: 460},
      }),
      input: {
        color: Kb.Styles.globalColors.black,
        ...Kb.Styles.globalStyles.fontTerminal,
      },
      inputContainer: {
        borderColor: Kb.Styles.globalColors.black_10,
        borderRadius: 4,
        borderStyle: 'solid',
        borderWidth: 1,
        minHeight: 77,
        padding: Kb.Styles.globalMargins.small,
        width: '100%',
      },
    }) as const
)

export default Container
