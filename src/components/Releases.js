import React, { Component } from 'react';
import CreateRelease from './CreateRelease';
import Tasks from './Tasks';
import Divider from './Divider';
import { connect } from 'react-redux';


class Releases extends Component {

    constructor(props) {
        super(props);
        this.state = {
            editRelease: {},
            index: null,
            actionType: null,
            enableTasks: false,
            enableActions: false,
            enableCreateTask: false,
            enableDropdown: false,
            progress: 'In Progress',
            error: false,            
        };
    }

    setStatus = (status, e) => {
        e.stopPropagation();
        const newRelease = {
            ...this.state.editRelease,
            status: status,
        };
        this.setState({
            editRelease: { ...newRelease },
            enableDropdown: false,
        });
    };

    onChangeHandler = (type, e) => {
        const newRelease = {
            ...this.state.editRelease,
            [type]: e.target.value,
        };
        this.setState({
            editRelease: { ...newRelease },
        });
        return;
    };

    editRelease = () => {
        const isEmpty = this.state.editRelease.version &&
            this.state.editRelease.startDate &&
            this.state.editRelease.releaseDate &&
            this.state.editRelease.description;

        let validDate = (Date.parse(this.state.editRelease.startDate) > Date.parse(this.state.editRelease.releaseDate))

        if (!isEmpty || validDate) {
            this.setState({ error: true })
            return;
        }

        this.props.updateRelease(this.state.editRelease);

        this.setState({
            editRelease: {},
            actionType: null,
            error: false,
        });
    };

    formatDate = (date) => {
        return date.split('-').reverse().join('/');
    };

    closeActions = (e) => {
        e.stopPropagation();
        this.setState({ index: null, enableActions: false });
    };

    removeRelease = (rId, e) => {
        e.stopPropagation();
        this.closeActions(e);
        this.props.deleteRelease(rId);
    }    

    enableEdit = (release, index, action, e) => {
        e.stopPropagation();
        this.closeActions(e);
        this.setState({
            index: index,
            editRelease: { ...release },
            actionType: action,
        });
    };

    showTasks = (index, e) => {
        e.stopPropagation();
        this.setState({ enableTasks: !this.state.enableTasks, index: index, actionType: null, });
    };

    createTask = (index, e) => {
        e.stopPropagation();
        if (!this.state.enableTasks) {
            this.showTasks(index, e);
        }
        this.setState({ enableActions: false, enableCreateTask: true });
    };
    
    getTasks = (rId, index) => {
        if (this.state.index === index && this.state.enableTasks) {
            let filteredTasks = this.props.tasks.filter(task => task.pId === rId);            
            return (
                <Tasks
                    tasks={filteredTasks}
                    enableCreate={this.state.enableCreateTask}
                    releaseId={rId}                    
                />
            );
        }
        return null;
    };

    calculateProgress = (rId) => {
        let filteredTasks = this.props.tasks.filter(task => task.pId === rId);
        let percent = 0;
        filteredTasks.forEach((task) => {
            percent += parseInt(task.progress);
        });
        percent = Math.round(percent / filteredTasks.length) || 0;
        return (
            <div className="progress purple darken-4" style={{ height: "10px", borderRadius: '10px' }}>
                <div className="determinate green" style={{ width: `${percent}%` }}></div>
            </div>
        );
    };

    expandDropdown = (index, e) => {
        e.stopPropagation();
        this.setState({ enableDropdown: !this.state.enableDropdown, index: index })
    };

    swapTasks = (rId, e) => {
        e.preventDefault();
        let data = JSON.parse(e.dataTransfer.getData("dragContent"));
        this.props.updateTask({ task: data, rId: rId })
    };

    showStatus = (status) => {
        switch (status.toLowerCase()) {
            case 'in progress':
                return (
                    <span className="light-blue lighten-4"
                        style={{ padding: '2px 4px', borderRadius: '3px' }}
                    >{status.toUpperCase()}</span>
                );                
            case 'un released':
                return (
                    <span className="lime lighten-2"
                        style={{ padding: '2px 4px', borderRadius: '3px' }}
                    >{status.toUpperCase()}</span>
                );                
            case 'released':
                return (
                    <span className="green lighten-3"
                        style={{ padding: '2px 4px', borderRadius: '3px' }}
                    >{status.toUpperCase()}</span>
                );                
            default:
                return (
                    <span className="light-blue lighten-4"
                        style={{ padding: '2px 4px', borderRadius: '3px' }}
                    >IN PROGRESS</span>
                );
        }

    };

    getReleases = () => {
        return (
            this.props.releases.map((release, index) => {
                return (
                    (this.state.actionType === 'edit' && this.state.index === index) ?
                        <div
                            className="row center-align Hover-items"
                            key={'input' + release.id}
                            style={{
                                padding: '10px',
                                marginBottom: '0px',
                            }}
                        >
                            <div
                                className="col s1 Hover"
                                style={{
                                    padding: '1px',
                                    marginBottom: '0px',
                                }}
                            >
                                <i className="material-icons">list</i>
                            </div>
                            <div className="col s1">
                                <input
                                    type="text"
                                    value={this.state.editRelease.version}
                                    onChange={this.onChangeHandler.bind(this, 'version')}
                                />
                                {
                                    (this.state.error && !this.state.editRelease.version) ?
                                        <div className="red-text">* Version Required</div> : null
                                }
                            </div>
                            <div className="input-field col s2" onClick={this.expandDropdown.bind(this, index)}
                                style={{ marginTop: '10px' }}
                            >
                                <div style={{ borderBottom: '1px solid lightgrey', }}>
                                    {this.state.editRelease.status}
                                    <i className="material-icons">
                                        {
                                            (this.state.enableDropdown && this.state.index === index) ?
                                                'expand_less' : 'expand_more'
                                        }
                                    </i>
                                </div>

                                {
                                    (this.state.enableDropdown && this.state.index === index) ?
                                        <div
                                            style={{
                                                position: 'absolute',
                                                left: '20%',
                                                zIndex: '10',
                                                background: 'lightgrey',
                                                color: 'black',
                                                borderRadius: '4px',
                                            }}
                                            className='Hover Hover-items'
                                        >
                                            <div
                                                className='Action'
                                                onClick={this.setStatus.bind(this, 'In Progress')}
                                            >In Progress</div>
                                            <div
                                                className='Action'
                                                onClick={this.setStatus.bind(this, 'Un Released')}
                                            >Un Released</div>
                                            <div
                                                className='Action'
                                                onClick={this.setStatus.bind(this, 'Released')}
                                            >Released</div>
                                        </div> : null
                                }
                            </div>
                            <div className="col s2" style={{ paddingTop: '10px' }}>
                                {
                                    this.calculateProgress(release.id)
                                }
                            </div>
                            <div className="col s2">
                                <input
                                    type="date"
                                    value={this.state.editRelease.startDate}
                                    onChange={this.onChangeHandler.bind(this, 'startDate')}
                                />
                            </div>
                            <div className="col s2">
                                <input
                                    type="date"
                                    value={this.state.editRelease.releaseDate}
                                    onChange={this.onChangeHandler.bind(this, 'releaseDate')}
                                />
                                {
                                    (Date.parse(this.state.editRelease.startDate) > Date.parse(this.state.editRelease.releaseDate)) ?
                                        <div className="red-text">* EndDate > StartDate</div> : null
                                }
                            </div>
                            <div className="col s1">
                                <input
                                    type="text"
                                    value={this.state.editRelease.description}
                                    onChange={this.onChangeHandler.bind(this, 'description')}
                                />
                                {
                                    (this.state.error && !this.state.editRelease.description) ?
                                        <div className="red-text">* Desc Required</div> : null
                                }
                            </div>
                            <div className="col s1">
                                <button
                                    style={{ height: '2.9rem' }}
                                    className="btn teal white-text"
                                    onClick={this.editRelease.bind(this)}
                                >EDIT</button>
                            </div>
                        </div>
                        :
                        <div key={'item' + release.id}>
                            <div
                                className="row left-align Hover-items"
                                // key={'item' + release.id}
                                style={{
                                    padding: '10px',
                                    marginBottom: '0px',
                                    background: `${this.state.index === index && this.state.enableTasks ? 'lightgrey' : 'transparent'}`,
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    return false;
                                }}
                                onDrop={this.swapTasks.bind(this, release.id)}
                            >
                                <div
                                    className="col s1 Hover center-align"
                                >
                                    <i className="material-icons"
                                        onClick={this.showTasks.bind(this, index)}
                                    >list</i>

                                    {
                                        (this.state.index === index && this.state.enableActions) ?
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    right: '2%',
                                                    zIndex: '10',
                                                    background: 'lightgrey',
                                                    color: 'black',
                                                    borderRadius: '4px',
                                                }}
                                                className='Hover Hover-items'
                                            >
                                                <div
                                                    style={{
                                                        float: 'right',
                                                    }}
                                                    onClick={this.closeActions.bind(this)}
                                                ><i className="tiny material-icons">clear</i>
                                                </div>
                                                <div
                                                    className='Action'
                                                    onClick={this.enableEdit.bind(this, release, index, 'edit')}
                                                >Edit</div>
                                                <div
                                                    className='Action'
                                                    onClick={this.removeRelease.bind(this, release.id)}
                                                >Delete</div>
                                                <div
                                                    className='Action'
                                                    onClick={this.createTask.bind(this, index)}
                                                >Create Task</div>
                                            </div> : null
                                    }
                                </div>
                                <div className="col s1">{release.version || '- -'}</div>
                                <div className="col s2">
                                    {
                                        this.showStatus(release.status)
                                    }
                                </div>
                                <div className="col s2">
                                    {
                                        this.calculateProgress(release.id)
                                    }
                                </div>
                                <div className="col s2">{this.formatDate(release.startDate) || '- -'}</div>
                                <div className="col s2">{this.formatDate(release.releaseDate) || '- -'}</div>
                                <div className="col s1 truncate">{release.description || '- -'}</div>
                                <div
                                    className="col s1 Hover center-align"
                                    onClick={() => this.setState({ index: index, enableActions: true, })}
                                >
                                    <i className="material-icons">more_horiz</i>
                                </div>
                            </div>
                            {
                                this.getTasks(release.id, index)
                            }
                        </div>
                )
            })

        )
    };


    render() {
        return (
            <div>
                <div>
                    <div className="row left-align"
                        style={{
                            marginBottom: '4px',
                            paddingBottom: '0px',
                        }}
                    >
                        <div className="col s1"></div>
                        <h6 className="col s1">Version</h6>
                        <h6 className="col s2">Status</h6>
                        <h6 className="col s2">Progress</h6>
                        <h6 className="col s2">Start Date</h6>
                        <h6 className="col s2">Release Date</h6>
                        <h6 className="col s1">Description</h6>
                        <h6 className="col s1">Actions</h6>
                    </div>

                    <Divider />

                    {
                        this.getReleases()
                    }

                </div>

                <CreateRelease />

            </div>
        );
    }
}

const mapStoreToProps = (store) => {
    return {
        releases: store.release.releases,
        tasks: store.task.tasks,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        updateRelease: (release) => {
            dispatch({ type: 'UPDATE_RELEASE', release });
        },
        deleteRelease: (releaseId) => {
            dispatch({ type: 'REMOVE_RELEASE', releaseId });
        },
        updateTask: (payload) => {
            dispatch({ type: 'UPDATE_TASK', payload });
        },
    }
};

export default connect(mapStoreToProps, mapDispatchToProps)(Releases);
