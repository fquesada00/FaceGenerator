import React from "react"
import DrawerButton from "./DrawerButton"
import drawerButtons from "./DrawerButtons"
const DrawerContent = () => {
  return (
    <React.Fragment>
      {drawerButtons.map(({ icon: Icon, path, text, style }, index) => (
        <DrawerButton
          key={index}
          icon={<Icon style={style} />}
          text={text}
          path={path}
        />
      ))}
    </React.Fragment>
  )
}

export default DrawerContent
