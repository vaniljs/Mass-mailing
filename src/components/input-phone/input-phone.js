import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class InputPhone extends Component {

    state = {
        selected: true,
        fileName: "",
        require: this.props.required,
    };

    onKeyDownInputPhone = (event) => {
        if( !(event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace' || event.key === 'Tab')) { event.preventDefault() }
        const mask = '+7 (111) 111-11-11';
        if (/[0-9\+\ \-\(\)]/.test(event.key)) {
            let currentString = event.target.value;
            let currentLength = currentString.length;
            if (/[0-9]/.test(event.key)) {
                if (mask[currentLength] === '1') {
                    event.target.value = currentString + event.key;
                } else {
                    for (let i=currentLength; i<mask.length; i++) {
                        if (mask[i] === '1') {
                            event.target.value = currentString + event.key;
                            break;
                        }
                        currentString += mask[i];
                    }
                }
            }
        }
    };

    onClickInputPhone = (e) => {
        !e.target.value ? e.target.value = "+7 " : false;
    };

    render() {

        let {selected, fileName, require} = this.state;

        return (
            <React.Fragment>
                <input
                    name="phone"
                    type="text"
                    placeholder="+7 (999) 888-77-55"
                    onKeyDown={this.onKeyDownInputPhone}
                    onClick={this.onClickInputPhone}
                />
            </React.Fragment>
        )
    }
};
