// import { REHYDRATE } from 'redux-persist';

const initialState = {
    releases: [
        {
            id: 1,
            version: 'Version 1.0',
            status: 'In Progress',
            startDate: '18/05/2020',
            releaseDate: '19/05/2020',
            description: 'This is about Version 1.0',
        },
    ],
    count: 1,
}

const releaseReducer = (state = initialState, action) => {

    let newState = { ...state };

    // eslint-disable-next-line

    switch (action.type) {

        case 'ADD_RELEASE':
            action.release.id = ++(newState.count);
            newState.releases = [...newState.releases, action.release];
            break;

        case 'UPDATE_RELEASE':
            const index = newState.releases.findIndex(release => release.id === action.release.id);
            newState.releases[index] = action.release;
            break;

        case 'REMOVE_RELEASE':
            newState.releases = newState.releases.filter(release => release.id !== action.releaseId);
            break;

        case 'persist/REHYDRATE':
            if (action.payload) {
                newState.releases = action.payload.release.releases;
                newState.count = action.payload.release.count;
            }
            break;
        default:
        // handle default case
    }
    return newState;
}

export default releaseReducer;