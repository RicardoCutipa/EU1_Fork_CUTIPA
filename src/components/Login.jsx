import React, { useState } from 'react';
import { Form, Input, Button, Alert, Card, Typography, Divider } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { login } from '../services/LoginService';

const { Title, Text } = Typography;

const Login = ({ onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const onFinish = async (values) => {
    const { username, password } = values;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await login(username, password);
      setLoading(false);
      
      if (response.success) {
        if (onLoginSuccess) {
          onLoginSuccess(response);
        }
      } else {
        setError('Error de inicio de sesión: ' + response.message);
      }
    } catch (error) {
      setLoading(false);
      setError('Error de inicio de sesión: ' + (error.message || 'Credenciales inválidas'));
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)' // Fondo degradado sutil
    }}>
      <Card 
        style={{ 
          width: 400, 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', // Sombra más pronunciada
          borderRadius: '12px' // Bordes redondeados
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2}>Sistema de Auditoría</Title>
          <Text type="secondary">Ingresa tus credenciales para acceder al panel</Text>
        </div>
        
        {error && <Alert message={error} type="error" showIcon closable style={{ marginBottom: 20 }} />}
        
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: 'Por favor ingresa tu nombre de usuario' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Nombre de usuario" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            label="Contraseña"
            name="password"
            rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              size="large"
            />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 0 }}>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              size="large"
              style={{ marginTop: 12 }}
            >
              Iniciar Sesión
            </Button>
          </Form.Item>
          
          <Divider>Credenciales de Demo</Divider>
          
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">Usuario: auditor</Text><br/>
            <Text type="secondary">Contraseña: auditorPass.2025</Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Login;