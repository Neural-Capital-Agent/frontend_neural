import react from 'react';
import QuickAdvice from './QuickAnalisis';
import MarketTools from './MarketTools';  

const TierStatus = ({ memberShipData}) => {
    if (memberShipData && (memberShipData.tier === 'premium' || memberShipData.tier === 'enterprise')) {
        return(<><p>    </p></>);
    }
    else if (memberShipData && memberShipData.tier === 'basic') {
    return (
        <div>

        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 m-3" role="alert">
          <p>⚠️ Your current plan is <strong>{memberShipData.tier}</strong>. To access the chat and analysis features, please upgrade your plan.</p>
        </div>
        <div className="mb-6">
            <p>Credits remaining: {memberShipData.credits_remaining}</p>
        </div>
        <MarketTools />
         <QuickAdvice />
        </div>
    );
    }else
    {
        return (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">No Active Plan</p>
                <p>You do not have an active membership plan</p>
                <a href="/pricing" className="mt-2 inline-block bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition">
                View Pricing Plans</a>
            </div>
        );
    }
}

export default TierStatus;