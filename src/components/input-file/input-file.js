import React, {Component} from 'react';
import ReactDOM from 'react-dom';

export default class Inputfile extends Component {

    state = {
        selected: true,
        fileName: "",
        require: this.props.required,
    };

    setName = (e) => {
        this.setState({
            fileName: e.target.value.replace(/^.*[\\\/]/, '')
        })
    };

    render() {

        let {selected, fileName, require} = this.state;

        return (
            <div
                className="input_file_wrapper">
                <span>{fileName}</span>
                <label htmlFor="file" className="btn_select">
                        <p>{fileName ? "Выбран" : "Выберите файл"}</p>
                </label>
                <input
                    type="file"
                    id="file"
                    name="file[]"
                    multiple
                    onChange={this.setName}/>
            </div>
        )
    }
};
