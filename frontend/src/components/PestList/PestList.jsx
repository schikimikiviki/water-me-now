import './PestList.css';
import { useState, useEffect } from 'react';
import getRequest from '../../helpers/functions';

function PestList() {
  const [pests, setPests] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      let pests = await getRequest('pests');
      console.log('GOT: ', pests);
      setPests(pests);
    };

    fetchData();
  }, []);

  return (
    <div className='page-div'>
      <h1>Pests</h1>
      {pests && pests.length > 0 ? (
        <ul>
          {pests.map((pest) => (
            <li key={pest.id}>{pest.name}</li>
          ))}
        </ul>
      ) : (
        <p>Loading pests...</p>
      )}
    </div>
  );
}

export default PestList;
