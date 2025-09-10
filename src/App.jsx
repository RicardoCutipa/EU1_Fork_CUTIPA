import assets from "./data/assets.json";
import { evaluateAsset } from "./services/AiService";
import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Table, Modal, Layout, Typography, message } from 'antd';
import { LogoutOutlined, UserOutlined } from '@ant-design/icons';
import Login from './components/Login';
import { isAuthenticated, logout } from './services/LoginService';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const EditableContext = React.createContext(null);

// Editable Row Component
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

// Editable Cell Component
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);
  
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({
        ...record,
        ...values,
      });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[{ required: true, message: `${title} is required.` }]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{ paddingRight: 24 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }
  return <td {...restProps}>{childNode}</td>;
};

// Main App Component
const App = () => {
  // Authentication state
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('user') || '');
  
  // Handle successful login
  const handleLoginSuccess = (response) => {
    setAuthenticated(true);
    setCurrentUser(response.user);
    message.success(`Bienvenido, ${response.user}!`);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setCurrentUser('');
    message.info('Sesión cerrada correctamente');
  };
  
  // Application state
  const [isLoading, setIsLoading] = useState(false);
  const [isRecommending, setIsRecommending] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const [dataSource, setDataSource] = useState(
    assets.map((a, index) => {
      const r = evaluateAsset(a);
      return {
        key: index + 1,
        activo: r.activo,
        riesgo: r.probabilidad,
        impacto: r.impacto,
        tratamiento: "-"
      };
    })
  );
  
  const [count, setCount] = useState(dataSource.length + 1);
  const [newData, setNewData] = useState({ activo: '' });

  // Show modal for adding new asset
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Hide modal
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  
  // Handle deletion of a row
  const handleDelete = (key) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  // Handle adding new asset
  const handleOk = () => {
    if (!newData.activo.trim()) {
      message.error('Por favor ingresa un nombre de activo');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const newRow = {
        key: count,
        activo: newData.activo,
        riesgo: 'Media',
        impacto: 'Medio',
        tratamiento: '-'
      };
      
      setDataSource([...dataSource, newRow]);
      setCount(count + 1);
      
      setIsModalVisible(false);
      setIsLoading(false);
      setNewData({ activo: '' });
      message.success(`Activo "${newData.activo}" agregado con éxito`);
    }, 1000);
  };

  // Handle recommendation of treatments
  const handleRecommendTreatment = () => {
    if (dataSource.length === 0) {
      message.warning("No hay activos para recomendar tratamientos");
      return;
    }
  
    setIsRecommending(true);
  
    setTimeout(() => {
      const newDataSource = dataSource.map((item) => {
        const asset = assets.find(a => a.name === item.activo) || { name: item.activo, type: 'General', criticality: 'Media' };
        const evalResult = evaluateAsset(asset);
        return {
          ...item,
          tratamiento: evalResult.recomendaciones.join("; ")
        };
      });
  
      setDataSource(newDataSource);
      setIsRecommending(false);
      message.success("Tratamientos recomendados aplicados con éxito");
    }, 1000);
  };

  // Handle save after cell edit
  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  // Define table columns
  const defaultColumns = [
    { title: 'Activo', dataIndex: 'activo', width: '20%', editable: true },
    { title: 'Riesgo', dataIndex: 'riesgo', width: '15%', editable: true },
    { title: 'Impacto', dataIndex: 'impacto', width: '25%', editable: true },
    { title: 'Tratamiento', dataIndex: 'tratamiento', width: '30%', editable: true },
    {
      title: 'Operación',
      dataIndex: 'operation',
      render: (_, record) => (
        dataSource.length >= 1 ? (
          <Popconfirm title="¿Seguro que quieres eliminar?" onConfirm={() => handleDelete(record.key)}>
            <a>Eliminar</a>
          </Popconfirm>
        ) : null
      ),
    },
  ];

  const components = { body: { row: EditableRow, cell: EditableCell } };

  const columns = defaultColumns.map((col) => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record) => ({ record, editable: col.editable, dataIndex: col.dataIndex, title: col.title, handleSave }),
    };
  });

  if (!authenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 24px' }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>Sistema de Auditoría de Riesgos</Title>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Text style={{ color: 'white', marginRight: 16 }}><UserOutlined /> {currentUser}</Text>
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout}>Cerrar Sesión</Button>
        </div>
      </Header>
      
      <Content style={{ padding: '24px' }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8 }}>
          <Button onClick={showModal} type="primary" style={{ marginBottom: 16 }}>+ Agregar activo</Button>
          <Button onClick={handleRecommendTreatment} loading={isRecommending} style={{ marginBottom: 16, marginLeft: 8 }}>Recomendar tratamientos</Button>
          
          <Modal
            title="Agregar nuevo activo"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            okText="Agregar"
            cancelText="Cancelar"
            confirmLoading={isLoading}
          >
            <Form layout="vertical">
              <Form.Item label="Activo" required>
                <Input 
                  value={newData.activo} 
                  onChange={(e) => setNewData({ ...newData, activo: e.target.value })}
                  placeholder="Ej: Base de datos de clientes" 
                />
              </Form.Item>
            </Form>
          </Modal>

          <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 10 }}
          />

          {/* LA LÍNEA DE CÓDIGO <Evaluations /> FUE ELIMINADA DE AQUÍ */}

        </div>
      </Content>
      
      <Footer style={{ textAlign: 'center' }}>
        Sistema de Auditoría de Riesgos ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;