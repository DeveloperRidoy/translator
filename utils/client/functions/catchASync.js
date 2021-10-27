const catchASync = (fn, setState) => fn().catch(err => {
    setState(state => ({ ...state, error: err.response?.data?.message || err.message || 'network error' }));
});


export default catchASync;