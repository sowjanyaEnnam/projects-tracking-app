import React from 'react';

function Divider(props) {
    return (
        <div
            style={{
                borderBottom: '1px solid grey',
                marginBottom: '10px',
            }}
        ></div>
    );
}

export default React.memo(Divider);