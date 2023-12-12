import CircularProgress from '@mui/material/CircularProgress';

const LoadingOverlay = ({ isLoading }) => {
  return isLoading ? (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <CircularProgress />
    </div>
  ) : null;
};

export default LoadingOverlay;
