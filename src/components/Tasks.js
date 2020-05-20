import React, { Component } from 'react';
import Divider from './Divider';
import { connect } from 'react-redux';

const initTask = {
    status: 'In Progress',
    progress: '',
    startDate: '',
    endDate: '',
    description: '',
};

class Tasks extends Component {

    constructor(props) {
        super(props);        
        this.state = {
            task: { ...initTask, pId: props.releaseId },
            error: false,
            enableDropdown: false,
            index: null,
            taskEdit: {},
            actionType: null,
        };
    }

    onChangeHandler = (type, e) => {
        e.stopPropagation();
        let value = e.target.value;
        if (type.toLowerCase() === 'progress') {
            if (value > 100) {
                value = 100;
            }
            if (value < 0) {
                value = 0;
            }
        }
        const newTask = {
            ...this.state.task,
            [type]: value,
        };
        this.setState({
            task: { ...newTask },
        });
    };

    setStatus = (status, e) => {
        e.stopPropagation();
        const newTask = {
            ...this.state.task,
            status: status,
        };
        this.setState({
            task: { ...newTask },
            enableDropdown: false,
        });
    };

    formatDate = (date) => {
        return date.split('-').reverse().join('/');
    };

    updateTask = (e) => {
        e.stopPropagation();
        const isEmpty = this.state.taskEdit.progress &&
            this.state.taskEdit.startDate &&
            this.state.taskEdit.endDate &&
            this.state.taskEdit.description;
        let validDate = (Date.parse(this.state.taskEdit.startDate) > Date.parse(this.state.taskEdit.endDate))
        if (!isEmpty || validDate) {
            this.setState({ error: true })
            return;
        }
        this.props.editTask(this.state.taskEdit);
        this.setState({
            taskEdit: {},
            actionType: null,
            error: false,
            index: null,
        });
    }

    addTask = (e) => {
        e.stopPropagation();
        const isEmpty = this.state.task.progress &&
            this.state.task.startDate &&
            this.state.task.endDate &&
            this.state.task.description;
        let validDate = (Date.parse(this.state.task.startDate) > Date.parse(this.state.task.endDate))
        if (!isEmpty || validDate) {
            this.setState({ error: true })
            return;
        }        
        this.props.addTask(this.state.task);
        this.setState({
            task: { ...initTask },
            error: false,
        });        
    };

    calculateProgress = (progress) => {
        let percent = Math.round(parseInt(progress)) || 0;
        return (
            <div className="progress purple darken-4" style={{ height: "10px", borderRadius: '10px' }}>
                <div className="determinate green" style={{ width: `${percent}%` }}></div>
            </div>
        );
    }

    expandDropdown = (e) => {
        e.stopPropagation();
        this.setState({ enableDropdown: !this.state.enableDropdown })
    };

    clearTask = (id, e) => {
        e.stopPropagation();
        this.props.removeTask(id);
    }

    onChangeEditHandler = (type, e) => {
        e.stopPropagation();
        let value = e.target.value;
        if (type.toLowerCase() === 'progress') {
            if (value > 100) {
                value = 100;
            }
            if (value < 0) {
                value = 0;
            }
        }
        const newTask = {
            ...this.state.taskEdit,
            [type]: value,
        };
        this.setState({
            taskEdit: { ...newTask },
        });
    };

    editTask = (task, index, action, e) => {
        e.stopPropagation();
        this.setState({
            index: index,
            taskEdit: { ...task },
            actionType: action,
        });
    }

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

    getEditTask = (index) => {
        return (
            <div className="row left-align" key={'taskedit' + this.state.taskEdit.id}>
                <div className="col s2 input-field" style={{}}>{this.state.taskEdit.status}</div>
                <div className="col s2">
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={this.state.taskEdit.progress}
                        placeholder='0 - 100%'
                        onChange={this.onChangeEditHandler.bind(this, 'progress')}
                    />
                    {
                        (this.state.error && !this.state.taskEdit.progress) ?
                            <div className="red-text">* Progress Required</div> : null
                    }
                </div>
                <div className="col s2">
                    <input
                        type="date"
                        value={this.state.taskEdit.startDate}
                        onChange={this.onChangeEditHandler.bind(this, 'startDate')}
                    />
                    {
                        (this.state.error && !this.state.taskEdit.startDate) ?
                            <div className="red-text">* StartDate Required</div> : null
                    }
                </div>
                <div className="col s2">
                    <input
                        type="date"
                        value={this.state.taskEdit.endDate}
                        onChange={this.onChangeEditHandler.bind(this, 'endDate')}
                    />
                    {
                        (this.state.error && !this.state.taskEdit.endDate) ?
                            <div className="red-text">* EndDate Required</div> : null
                    }
                    {
                        (Date.parse(this.state.taskEdit.startDate) > Date.parse(this.state.taskEdit.endDate)) ?
                            <div className="red-text">* EndDate > StartDate</div> : null
                    }
                </div>
                <div className="col s3">
                    <input
                        type="text"
                        value={this.state.taskEdit.description}
                        placeholder='Add Description'
                        onChange={this.onChangeEditHandler.bind(this, 'description')}
                    />
                    {
                        (this.state.error && !this.state.taskEdit.description) ?
                            <div className="red-text">* Desc Required</div> : null
                    }
                </div>
                <div className="col s1">
                    <button
                        style={{ height: '2.9rem', width: '100%' }}
                        className="btn teal white-text"
                        onClick={this.updateTask.bind(this)}
                    >EDIT</button>
                </div>
            </div>
        )
    };

    getTasks = () => {
        return (
            this.props.tasks.map((task, index) => {
                return (
                    (this.state.actionType === 'edit' && this.state.index === index) ?
                        this.getEditTask(index)
                        :
                        <div
                            className="row Hover Hover-task-items"
                            key={'task' + task.id}
                            style={{
                                padding: '10px'
                            }}
                            draggable
                            onDragStart={(e) => {
                                e.dataTransfer.setData("dragContent", JSON.stringify(task));
                            }}
                        >
                            <div className="col s2">{this.showStatus(task.status)}</div>
                            <div className="col s2">
                                {
                                    this.calculateProgress(task.progress)
                                }
                            </div>
                            <div className="col s2">{this.formatDate(task.startDate)}</div>
                            <div className="col s2">{this.formatDate(task.endDate)}</div>
                            <div className="col s2 truncate">{task.description}</div>
                            <div className="col s1">
                                <button
                                    style={{ height: '2.9rem', width: '100%' }}
                                    className="btn teal white-text"
                                    onClick={this.editTask.bind(this, task, index, 'edit')}
                                >EDIT</button>
                            </div>
                            <div className="col s1">
                                <button
                                    style={{ height: '2.9rem', width: '100%' }}
                                    className="btn teal white-text"
                                    onClick={this.clearTask.bind(this, task.id)}
                                >CLEAR</button>
                            </div>
                        </div>
                );
            })
        );
    };

    createTask = () => {
        return (
            <div className="row left-align">
                <div className="input-field col s2" onClick={this.expandDropdown.bind(this)}>
                    <div style={{ borderBottom: '1px solid lightgrey', }}>
                        {this.state.task.status}
                        <i className="material-icons">
                            {
                                this.state.enableDropdown ? 'expand_less' : 'expand_more'
                            }
                        </i>
                    </div>

                    {
                        this.state.enableDropdown ?
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
                <div className="col s2">
                    <input
                        type="number"
                        min="1"
                        max="100"
                        value={this.state.task.progress}
                        placeholder='0 - 100%'
                        onChange={this.onChangeHandler.bind(this, 'progress')}
                    />
                    {
                        (this.state.error && !this.state.task.progress && !this.state.actionType) ?
                            <div className="red-text">* Progress Required</div> : null
                    }
                </div>
                <div className="col s2">
                    <input
                        type="date"
                        value={this.state.task.startDate}
                        onChange={this.onChangeHandler.bind(this, 'startDate')}
                    />
                    {
                        (this.state.error && !this.state.task.startDate && !this.state.actionType) ?
                            <div className="red-text">* StartDate Required</div> : null
                    }
                </div>
                <div className="col s2">
                    <input
                        type="date"
                        value={this.state.task.endDate}
                        onChange={this.onChangeHandler.bind(this, 'endDate')}
                    />
                    {
                        (this.state.error && !this.state.task.endDate && !this.state.actionType) ?
                            <div className="red-text">* EndDate Required</div> : null
                    }
                    {
                        (Date.parse(this.state.task.startDate) > Date.parse(this.state.task.endDate)) ?
                            <div className="red-text">* EndDate > StartDate</div> : null
                    }
                </div>
                <div className="col s3">
                    <input
                        type="text"
                        value={this.state.task.description}
                        placeholder='Add Description'
                        onChange={this.onChangeHandler.bind(this, 'description')}
                    />
                    {
                        (this.state.error && !this.state.task.description && !this.state.actionType) ?
                            <div className="red-text">* Desc Required</div> : null
                    }
                </div>
                <div className="col s1">
                    <button
                        style={{ height: '2.9rem', width: '100%' }}
                        className="btn teal white-text"
                        onClick={this.addTask.bind(this)}
                    >ADD</button>                    
                </div>
            </div>
        );
    };

    render() {
        return (
            <div
                className="grey lighten-1"
                style={{
                    padding: '20px',
                }}
            >
                <div className="row">
                    <h6 className="col s2">Status</h6>
                    <h6 className="col s2">progress</h6>
                    <h6 className="col s2">Start Date</h6>
                    <h6 className="col s2">End Date</h6>
                    <h6 className="col s3">Description</h6>
                </div>

                <Divider />

                {
                    this.props.tasks.length ?
                        this.getTasks()
                        : <div className='center-align'>No Tasks</div>
                }

                {
                    this.createTask()
                }
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        addTask: (task) => {
            dispatch({ type: 'ADD_TASK', task });
        },
        removeTask: (tId) => {
            dispatch({ type: 'DELETE_TASK', tId });
        },
        editTask: (task) => {
            dispatch({ type: 'EDIT_TASK', task });
        },
    }
};

export default connect(null, mapDispatchToProps)(Tasks);