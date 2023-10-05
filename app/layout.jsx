import '@styles/global.css';

export const metadata = {
  title: 'Live Stream',
  description: 'Let’s share what is in your mind with text based Social Media',
};

const RootLayout = ({ children }) => {
  return (
    <html lang="en" className="bg-threads-bg">
      <body className="font-lato">
        <div className="relative">{children}</div>
      </body>
    </html>
  );
};

export default RootLayout;
