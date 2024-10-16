// Home.jsx
import React from 'react';
import { useParams } from 'react-router-dom';
import LeftSidebar from '../components/LeftSidebar';
import SushiList from '../components/SushiList';
import SelectedItems from '../components/SelectedItems';

const Home = () => {
  const { category } = useParams();

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <LeftSidebar />
      <SushiList category={category} />
      <SelectedItems />
    </div>
  );
};

export default Home;
