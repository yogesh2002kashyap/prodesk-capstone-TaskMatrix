import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCheckoutSession } from '../services/stripeService';


export default function SuccessPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if(!sessionId){
            navigate('/board');
            return;
        }

        const verify = async () => {
            try{
                const data = await getCheckoutSession(sessionId);
                setSession(data);
                localStorage.setItem('tm_pro', 'true');
            }catch(err){
                setError('Could not verify payment. Please contact support.');
            }finally{
                setLoading(false);
            }
        ;}
            verify();
    }, [sessionId]);

    if(loading){
        return (
            <div className='min-h-screen flex items-center justify-center bg-brand-bg'>
                <p className='text-sm text-gray-400'>Verifying your payment...</p>
            </div>
        );
    }

    if(error){
        return (
            <div className='min-h-screen flex items-center justify-center bg-brand-bg'>
                <div className='bg-white rounded-md shadow-sm p-8 text-center max-w-sm w-full'>
                    <p className='text-sm text-red-800 mb-4'>{error}</p>
                    <button
                      onClick={() => navigate('/board')}
                      className="px-4 py-2 bg-brand-dark text-gray-50 text-xs rounded-md hover:bg-gray-900 transition"
                    >
                        Back to board
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-brand-bg'>
            <div className='bg-white rounded-md shadow-sm p-8 text-center max-w-sm w-full'>
                <div className='w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5'>
                    <span className='text-2xl'>✓</span>
                </div>
                <h1 className="text-base font-medium text-gray-900 mb-2">
                    You're now on Pro
                </h1>
                <p className="text-sm font-medium text-gray-800 mb-6">Payment confirmed for</p>
                <p className='text-sm font-medium text-gray-800 mb-6'>{session?.customerEmail}</p>

                <div className='bg-gray-50 rounded-md p-4 mb-6 text-left space-y-2'>
                    <p className="text-xs font-medium text-gray-800">TaskMatrix Pro includes:</p>
                    <p className="text-xs text-gray-400">✓ Unlimited projects</p>
                    <p className="text-xs text-gray-400">✓ Workload heatmap</p>
                    <p className="text-xs text-gray-400">✓ Priority support</p>
                    <p className="text-xs text-gray-400">✓ Advanced analytics</p>
                </div>

                <button onClick={() => navigate('/board')}
                    className="w-full py-2.5 bg-brand-dark text-gray-50 text-sm font-medium rounded-md hover:bg-gray-900 transition"
                >
                    Go to board
                </button>
            </div>
        </div>
    );
}