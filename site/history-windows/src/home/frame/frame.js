import React, {Component} from 'react';
import {Layout} from '@douyinfe/semi-ui';
import logo from './logo.svg';
import React, {Component} from 'react';
import {Button, Toast} from '@douyinfe/semi-ui';

class Home extends Component {
    constructor(props) {
        super(props);
    }

      onbreakpoint = (screen, bool) => {
        console.log(screen, bool);
    };
      {Header, Footer, Sider, Content} = Layout;
return (
    <Layout className="components-layout-demo">
        <Header>Header</Header>
        <Layout>
            <Sider breakpoint={['md']} onBreakpoint={onbreakpoint}>
                Sider
            </Sider>
            <Content>Content</Content>
        </Layout>
        <Footer>Footer</Footer>
    </Layout>
)
}

export default Home;
