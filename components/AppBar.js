import React from 'react';
import { Appbar } from 'react-native-paper';

const Header = ({ title }) => {
return (
    <Appbar.Header style={{ marginTop: 20, backgroundColor: 'blue' }}>
    <   Appbar.Content title={title} />
    </Appbar.Header>
);
};

export default Header;