import Link from 'next/link';

const Footer = () => {
  return (
    <>
      <footer className=''>
        
        <div className=''>
          <div className='container'>
            <p>
              Copyright 2022 <strong>Juno Staking</strong>. All Rights Reserved by{' '}
              <Link href='#'>
                <a target='_blank'>Juno Staking</a>
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
