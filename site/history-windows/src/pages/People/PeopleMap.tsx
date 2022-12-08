import {Button, Descriptions, PageHeader} from 'antd';
import React, {useEffect, useRef} from 'react';
import G6, {Graph} from '@antv/g6';
import {PeopleFormProps} from "@/pages/People/components/PeopleForm";

const PeopleMap: React.FC<PeopleFormProps> = (props) => {
  const data = {
    nodes: [
      {id: 'node0', size: 50},
      {id: 'node1', size: 30},
      {id: 'node2', size: 30},
      {id: 'node3', size: 30},
      {id: 'node4', size: 30, isLeaf: true},
      {id: 'node5', size: 30, isLeaf: true},
      {id: 'node6', size: 15, isLeaf: true},
      {id: 'node7', size: 15, isLeaf: true},
      {id: 'node8', size: 15, isLeaf: true},
      {id: 'node9', size: 15, isLeaf: true},
      {id: 'node10', size: 15, isLeaf: true},
      {id: 'node11', size: 15, isLeaf: true},
      {id: 'node12', size: 15, isLeaf: true},
      {id: 'node13', size: 15, isLeaf: true},
      {id: 'node14', size: 15, isLeaf: true},
      {id: 'node15', size: 15, isLeaf: true},
      {id: 'node16', size: 15, isLeaf: true},
    ],
    edges: [
      {source: 'node0', target: 'node1'},
      {source: 'node0', target: 'node2'},
      {source: 'node0', target: 'node3'},
      {source: 'node0', target: 'node4'},
      {source: 'node0', target: 'node5'},
      {source: 'node1', target: 'node6'},
      {source: 'node1', target: 'node7'},
      {source: 'node2', target: 'node8'},
      {source: 'node2', target: 'node9'},
      {source: 'node2', target: 'node10'},
      {source: 'node2', target: 'node11'},
      {source: 'node2', target: 'node12'},
      {source: 'node2', target: 'node13'},
      {source: 'node3', target: 'node14'},
      {source: 'node3', target: 'node15'},
      {source: 'node3', target: 'node16'},
    ],
  };
  const nodes = data.nodes;
  const ref: any = useRef(null);

  let graph: any = null;

  useEffect(() => {
    if (!graph) {
      graph = new G6.Graph({
        container: ref.current,
        width: 1000,
        height: 1000,
        modes: {
          default: ['drag-canvas', 'zoom-canvas', 'drag-node', 'lasso-select'],
        },
        layout: {
          type: 'force',
          preventOverlap: true,
          linkDistance: (d) => {
            if (d.source.id === 'node0') {
              return 300;
            }
            return 60;
          },
          nodeStrength: (d) => {
            if (d.isLeaf) {
              return -50;
            }
            return -10;
          },
          edgeStrength: (d) => {
            if (d.source.id === 'node1' || d.source.id === 'node2' || d.source.id === 'node3') {
              return 0.7;
            }
            return 0.1;
          },
        },
      });
    }
    graph.data({
      nodes,
      edges: data.edges.map(function (edge, i) {
        edge['id'] = 'edge' + i;
        return Object.assign({}, edge);
      }),
    });
    graph.render();

    const centerNodes = graph.getNodes().filter((node) => !node.getModel().isLeaf);

    graph.on('afterlayout', () => {
      const hull1 = graph.createHull({
        id: 'centerNode-hull',
        type: 'bubble',
        members: centerNodes,
        padding: 10,
      });

      const hull2 = graph.createHull({
        id: 'leafNode-hull1',
        members: ['node6', 'node7'],
        padding: 10,
        style: {
          fill: 'lightgreen',
          stroke: 'green',
        },
      });

      const hull3 = graph.createHull({
        id: 'leafNode-hull2',
        members: ['node8', 'node9', 'node10', 'node11', 'node12', 'node13'],
        padding: 10,
        style: {
          fill: 'lightgreen',
          stroke: 'green',
        },
      });

      graph.on('afterupdateitem', (e) => {
        hull1.updateData(hull1.members);
        hull2.updateData(hull2.members);
        hull3.updateData(hull3.members);
      });
    })
  });

  return <>
    <div className="site-page-header-ghost-wrapper">
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title="Title"
        subTitle="This is a subtitle"
        extra={[
          <Button key="3">Operation</Button>,
          <Button key="2">Operation</Button>,
          <Button key="1" type="primary">
            Primary
          </Button>,
        ]}
      >
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
          <Descriptions.Item label="Association">
            <a>421421</a>
          </Descriptions.Item>
          <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
          <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
          <Descriptions.Item label="Remarks">
            Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
    </div>
    <div ref={ref}></div>
  </>
}

export default PeopleMap;
