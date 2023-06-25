import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';


function Spinner() {
    return (
        <div className="spinner-container">
            <div>
                <ClipLoader color={'black'} size={150} />
            </div>
        </div>
    );
}

export default Spinner;