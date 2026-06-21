import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import { IoCloseSharp } from "react-icons/io5";
import CategoryCollapse from '../CategoryCollapse/index';

export default function Panel (props) {
  function toggleDrawer(newOpen) {
    return () => {
      props.setIsOpen(newOpen);
    };
  }
  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" className="categoryPanel" >
      <h3 className='!p-3 text-[16px] font-[500] flex items-center justify-between'> Achat par categories{""} <IoCloseSharp onClick={toggleDrawer(false)} 
      className='cursor-pointer text-[20px]'/>
      </h3>
      <CategoryCollapse/>
    </Box>
  );

  return (
    <div>
      <Drawer open={props.isOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
