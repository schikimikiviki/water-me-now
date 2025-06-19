import api from '../../api/axiosConfig';
function DatabaseButton() {
  const backendDownloadRequest = async () => {
    try {
      let command = `pg_dump -U ${import.meta.env.VITE_USER} -h localhost ${
        import.meta.env.VITE_URL
      } > dump.sql`;

      const params = new URLSearchParams();
      params.append('command', command);

      const response = await api.post('/run-command/download', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
      });

      console.log(response);
    } catch (err) {
      console.error('Command failed:', err);
    }
  };

  return (
    <button
      style={{
        margin: '40px',
        fontSize: '18px',
        backgroundColor: ' var(--color-yellow)',
      }}
      onClick={backendDownloadRequest}
    >
      Download database dump
    </button>
  );
}

export default DatabaseButton;
