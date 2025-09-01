import api from '../../api/axiosConfig';
function DatabaseButton() {
  const backendDownloadRequest = async () => {
    try {
      let command = `echo ${import.meta.env.VITE_PW} | pg_dump -U ${
        import.meta.env.VITE_USER
      } -h plants.vbdev.at/backend ${import.meta.env.VITE_URL} > dump.sql`;

      const params = new URLSearchParams();
      params.append('command', command);

      const response = await api.post('/run-command/download', params, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        withCredentials: true,
      });

      console.log(response);

      const blob = new Blob([response.data], {
        type: 'application/octet-stream',
      });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'dump.sql');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
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
