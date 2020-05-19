// import { REHYDRATE } from 'redux-persist';

const initialState = {
    tasks: [
        {
            id: 1,
            pId: 1,
            status: 'In Progress',
            progress: '30',
            startDate: '18/05/2020',
            endDate: '19/05/2020',
            description: 'This is about task 1',
        },
    ],
    count: 1,
}

const taskReducer = (state = initialState, action) => {

    let newState = { ...state };

    // eslint-disable-next-line

    switch (action.type) {

        case 'ADD_TASK':
            action.task.id = ++(newState.count);
            newState.tasks = [...newState.tasks, action.task];
            break;

        case 'UPDATE_TASK':
            newState.tasks = newState.tasks.filter(task => task.id !== action.payload.task.id);
            let task = { ...action.payload.task, pId: action.payload.rId };
            newState.tasks = [...newState.tasks, { ...task }];
            break;

        case 'REMOVE_RELEASE':
            // delete tasks here            
            break;

        case 'persist/REHYDRATE':
            if (action.payload) {
                newState.tasks = action.payload.task.tasks;
                newState.count = action.payload.task.count;
            }
            break;
        default:
        // handle default case
    }

    return newState;
}

export default taskReducer;