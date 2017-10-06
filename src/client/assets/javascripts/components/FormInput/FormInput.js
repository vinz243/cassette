import React, { PropTypes } from 'react'
import classnames from 'classnames';

class FormInput extends React.Component {
  static propTypes = {
    value: React.PropTypes.string.isRequired,
    onChange: React.PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    labelClassName: PropTypes.string,
    disabled: PropTypes.bool,
    intent: PropTypes.string,
    helper: PropTypes.string,
    required: PropTypes.bool,
    iconName: PropTypes.string.isRequired,
    inputId: PropTypes.string.isRequired,
    inline: PropTypes.bool.isRequired,
    type: PropTypes.string
  };
  render () {
    const props = this.props;
    const input = props.children ? props.children :
    <input id={props.inputId} className={classnames(
        'pt-input', {
          [`pt-intent-${props.intent}`]: props.intent
        }, props.inputClassName)}
      placeholder={props.placeholder}
      disabled={props.disabled}
      value={props.value}
      onChange={props.onChange}
      type={props.type || "text"} dir="auto" />;
    return <div className={classnames('pt-form-group', props.className, {
      [`pt-intent-${props.intent}`]: props.intent
    })}>
      <label className={classnames('pt-label', props.labelClassName)}
        htmlFor={props.inputId}>
        {props.label}
        {props.required ? <span className="pt-text-muted">(required)</span> : null}
      </label>
      <div className="pt-form-content">
        {props.iconName ?
          <div className={classnames('pt-input-group', {
            [`pt-intent-${props.intent}`]: props.intent
          })}>
            <span className={`pt-icon pt-icon-${props.iconName}`}></span>
          {input}
        </div> : input}
        {props.helper ? <div className={classnames("pt-form-helper-text")}>
          {props.helper}
        </div> : null}
      </div>
    </div>
  }
}

export default FormInput;
