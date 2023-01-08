import {Button, Descriptions, message, PageHeader} from 'antd';
import React, {useEffect, useRef, useState} from 'react';
import G6, {Graph} from '@antv/g6';
import {PeopleFormProps} from "@/pages/People/components/PeopleForm";
import {allPeopleAndRelation} from "@/services/history/listPeople";
import History from "@/services/history/typings";


const tooltip = new G6.Tooltip({
  offsetX: 10,
  offsetY: 10,
  fixToNode: [1, 0.5],
  // the types of items that allow the tooltip show up
  // 允许出现 tooltip 的 item 类型
  itemTypes: ['node', 'edge'],
  // custom the tooltip's content
  // 自定义 tooltip 内容
  getContent: (e: any) => {
    const outDiv = document.createElement('div');
    outDiv.style.width = 'fit-content';
    outDiv.style.height = 'fit-content';
    const model = e.item.getModel();
    if (e.item.getType() === 'node') {
      outDiv.innerHTML = `${model.label}`;
    } else {
      const source = e.item.getSource();
      const target = e.item.getTarget();
      outDiv.innerHTML = `来源：${source.getModel().label}<br/>去向：${target.getModel().label}`;
    }
    return outDiv;
  },
});

const PeopleMap: React.FC<PeopleFormProps> = (props) => {
  const [peopleNodes, setPeopleNodes] = useState<any[]>();
  const [relationEdges, setRelationEdges] = useState<any[]>();

  console.log(props)

  const ref: any = useRef(null);
  let graph: any = null;
  const nodes: any[] = []
  const edges: any[] = []

  useEffect(() => {
    message.loading('${pages.people.map.loading}');
    allPeopleAndRelation({}).then((rsp: Common.HTTPRsp<History.AllPeopleAndRelation>) => {
      if (rsp.success) {
        if (rsp.data != null) {
          message.loading('${pages.people.map.parsing}').then(r => {
            console.log(r)
          });
          // 人物转成Node
          const peoples = rsp.data.peoples || []
          // 关系转成边
          const relations = rsp.data.relations || []

          // region node
          peoples.forEach((p: History.People) => {
            nodes.push(
              {id: p.id, size: 40, label: p.name},
            )
          })
          // endregion

          // region edge
          relations.forEach((r: History.Relation) => {
            edges.push(
              {
                source: r.peopleIDA,
                target: r.peopleIDB,
                label: r.relation,
                style: {
                  endArrow: true,
                },
              },
            )
          })
          // endregion

          setPeopleNodes(nodes)
          setRelationEdges(edges)
        }
      } else {
        if (rsp.error) {
          message.error(rsp.error.msg).then((r) => {
            console.log(r)
          });
        }
      }
    }).finally(() => {
      if (!graph) {
        graph = new G6.Graph({
          container: ref.current,
          width: 1300,
          height: 1300,
          modes: {
            default: ['drag-canvas', 'activate-relations', 'zoom-canvas', 'drag-node', 'lasso-select'],
          },
          defaultEdge: {
            type: 'quadratic',
          },
          plugins: [tooltip],
          layout: {
            type: 'radial',
            unitRadius: 70,
            preventOverlap: true,
            strictRadial: false,
          },
        });
      }
      graph.data({
        nodes,
        edges: edges.map(function (edge, i) {
          edge['id'] = 'edge' + i;
          return Object.assign({}, edge);
        }),
      });
      graph.render();


      /*
       // 边界，用于人物圈子
       const centerNodes = graph.getNodes().filter((node: any) => !node.getModel().isLeaf);
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
       })*/
    })
  }, []);

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
