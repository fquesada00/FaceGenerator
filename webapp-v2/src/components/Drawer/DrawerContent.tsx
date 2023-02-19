import React from 'react';
import DrawerButton from './DrawerButton';
import drawerButtons from './DrawerButtons';

function DrawerContent() {
  return (
    <>
      {drawerButtons.map(({ icon: Icon, path, text, style }, index) => (
        <DrawerButton
          key={index}
          icon={<Icon style={style} />}
          text={text}
          path={path}
        />
      ))}
    </>
  );
}

export default DrawerContent;
