import React, { Component } from 'react';
import { connect } from 'react-redux';

const initRelease = {
    version: '',
    status: 'In Progress',
    startDate: '',
    releaseDate: '',
    description: '',
};

class CreateRelease extends Component {

    constructor(props) {
        super(props);
        this.state = {
            release: { ...initRelease },
            error: false,
        };
    }

    onChangeHandler = (type, e) => {
        const newRelease = {
            ...this.state.release,
            [type]: e.target.value,
        };
        this.setState({
            release: { ...newRelease },
        });
    };

    addRelease = () => {
        const isEmpty = this.state.release.version &&
            this.state.release.startDate &&
            this.state.release.releaseDate &&
            this.state.release.description;
        let validDate = (Date.parse(this.state.release.startDate) > Date.parse(this.state.release.releaseDate))
        if (!isEmpty || validDate) {
            this.setState({ error: true })
            return;
        }
        this.props.addRelease(this.state.release);
        this.setState({
            release: { ...initRelease },
            error: false,
        });
    };

    render() {
        return (
            <div>
                <div className="row" style={{ paddingTop: '10px', }}>
                    <div className="col s3">
                        <input
                            className="Input-release red lighten-2"
                            type="text"
                            placeholder="Version name"
                            value={this.state.release.version}
                            onChange={this.onChangeHandler.bind(this, 'version')}
                        />
                        {
                            (this.state.error && !this.state.release.version) ?
                                <div className="red-text">* Version Required</div> : null
                        }
                    </div>
                    <div className="col s2">
                        <input
                            className="Input-release red lighten-2"
                            type="date"
                            placeholder="Start Date"
                            value={this.state.release.startDate}
                            onChange={this.onChangeHandler.bind(this, 'startDate')}
                        />
                        {
                            (this.state.error && !this.state.release.startDate) ?
                                <div className="red-text">* Date Required</div> : null
                        }
                    </div>
                    <div className="col s2">
                        <input
                            className="Input-release red lighten-2"
                            type="date"
                            placeholder="Release Date"
                            value={this.state.release.releaseDate}
                            onChange={this.onChangeHandler.bind(this, 'releaseDate')}
                        />
                        {
                            (this.state.error && !this.state.release.releaseDate) ?
                                <div className="red-text">* Date Required</div> : null
                        }
                        {
                            (Date.parse(this.state.release.startDate) > Date.parse(this.state.release.releaseDate)) ?
                                <div className="red-text">* EndDate > StartDate</div> : null
                        }
                    </div>
                    <div className="col s4">
                        <input
                            className="Input-release red lighten-2"
                            type="text"
                            placeholder="Description"
                            value={this.state.release.description}
                            onChange={this.onChangeHandler.bind(this, 'description')}
                        />
                        {
                            (this.state.error && !this.state.release.description) ?
                                <div className="red-text">* Desc Required</div> : null
                        }
                    </div>
                    <div className="col s1">
                        <button
                            style={{ height: '2.9rem' }}
                            className="btn teal white-text"
                            onClick={this.addRelease}
                        >ADD</button>
                    </div>
                </div>
            </div >
        );
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        addRelease: (release) => {
            dispatch({ type: 'ADD_RELEASE', release });
        },
    }
};

export default connect(null, mapDispatchToProps)(CreateRelease);