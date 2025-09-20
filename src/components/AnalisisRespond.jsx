import React, { useState } from 'react';

const AnalisisRespond = ({ data }) => {
    return (
        <div className="analisis-respond"> 

            <h2>We are waiting to you chose your type of
                plan in the pricing page
            </h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};  
export default AnalisisRespond;