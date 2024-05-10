import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Col, Space, Image, Row, message } from 'antd';
import { PlusOutlined, SearchOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import {
    collection,
    addDoc,
    getDocs,
    doc,
    deleteDoc,
    updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../../config/firebaseconfig";
import { storage } from "../../config/firebaseconfig";
import { v4 as uuidv4 } from "uuid";
const { Column } = Table;

function Categories() {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);
    const [imgUpload, setImgUpload] = useState(null);
    const categoriesCollectionRef = collection(db, "Categories");
    const [categories, setCategories] = useState([]);
    const [update, setUpdate] = useState(false);
    const [categoryEdit, setCategoryEdit] = useState(null);
    

    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(categoriesCollectionRef);
            const categoriesData = [];
            querySnapshot.forEach((doc) => {
                categoriesData.push({ id: doc.id, ...doc.data() });
            });
            setCategories(categoriesData);
        };
        fetchData();
    }, [update]);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        form.resetFields(); // Reset the form fields when the modal is closed
        setPreviewImg(null);
        setCategoryEdit(null);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            // Display the selected image
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                setPreviewImg(reader.result);
            };
            setImgUpload(file);
            return false;
        },
    };

    const handleOk = async () => {
        if(categoryEdit) {
            try {
                const values = await form.validateFields();
                // If a new image is selected, upload it
                if (imgUpload) {
                    const storageRef = ref(storage, `categoryImages/${uuidv4()}`);
                    await uploadBytes(storageRef, imgUpload);
                    const categoryImgURL = await getDownloadURL(storageRef);
                    values.imgCategory = categoryImgURL;
                }
                // Update the document in Firestore
                await updateDoc(doc(categoriesCollectionRef, categoryEdit.id), values);
                // If there is a selected image, delete the old image    
                const oldFilename = categoryEdit.imgCategory.split('%2F').pop().split('?').shift();
                const oldImgRef = ref(storage, `categoryImages/${oldFilename}`);
                await deleteObject(oldImgRef);

                setUpdate(!update);
                message.success('Category updated successfully!');
                handleCancel();
            } catch (error) {
                console.error('Error updating category:', error);
                message.error('Failed to update category. Please try again.');
            }
        } else {
            try {
                const values = await form.validateFields();
                const storageRef = ref(storage, `categoryImages/${uuidv4()}`);
                await uploadBytes(storageRef, imgUpload);
                const categoryImgURL = await getDownloadURL(storageRef);
                await addDoc(collection(db, 'Categories'), {
                    nameCategory: values.nameCategory,
                    imgCategory: categoryImgURL,
                });
                setUpdate(!update);
                message.success('Category added successfully!');
                handleCancel();
            } catch (error) {
                console.error('Error adding category:', error);
                message.error('Failed to add category. Please try again.');
            } 
        }
             
    }
    const handleDelete = async (record) => {
        Modal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this item?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    const filename = record.imgCategory.split('%2F').pop().split('?').shift();

                    // Delete document from Firestore
                    await deleteDoc(doc(categoriesCollectionRef, record.id));

                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `categoryImages/${filename}`);

                    // Delete the file from storage
                    await deleteObject(desertRef);

                    // Update the state to trigger a re-render
                    setUpdate((prevUpdate) => !prevUpdate);
                } catch (error) {
                    console.error('Error deleting category:', error);
                    // Handle error gracefully, show a notification, or log the error as needed
                }
            },
        });
    };
    const handleEdit = async (record) => {
        form.setFieldsValue({
            nameCategory: record.nameCategory,
        })
        setPreviewImg(record.imgCategory);
        setCategoryEdit(record);
        setVisible(true);
    }

    return (
        <>
            <Row gutter={16} align="middle">
                <Col xs={24} md={6} xl={6} style={{ marginTop: "1em" }}>
                    <h3>List Categories</h3>
                </Col>
                <Col xs={24} md={12} xl={12} style={{ marginTop: "1em" }}>
                    <Input.Search
                        placeholder="Search categories"
                        style={{ width: '100%' }}
                        prefix={<SearchOutlined />}
                    />
                </Col>
                <Col xs={24} md={6} xl={6} style={{ marginTop: "1em" }}>
                    <Button type="primary" onClick={() => setVisible(true)} icon={<PlusOutlined />} style={{ width: '100%' }}>
                        Add Category
                    </Button>
                </Col>
            </Row>
            <Table dataSource={categories} pagination={{ pageSize: 5 }} style={{ marginTop: "1rem" }} className="responsive-table">
                <Column title="#" render={(text, record, index) => index + 1} key="index" />
                <Column
                    title="Img Category"
                    render={(text, record) => (
                        <Image width={50} src={record.imgCategory} />
                    )}
                />
                <Column title="Name Category" dataIndex="nameCategory" />
                <Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button onClick={() => handleEdit(record)} type="primary" ><EditOutlined /></Button>
                            <Button onClick={() => handleDelete(record)} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: "white" }} ><DeleteOutlined /></Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal
                title={categoryEdit ? "Edit Category" : "Add Category"}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name Category"
                        name="nameCategory"
                        rules={[{ required: true, message: 'Please enter the name of the category!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Image Category"
                        name="imgCategory"
                        rules={[{ required: true, message: 'Please upload an image for the category!' }]}
                    >
                        <Upload {...uploadProps}>
                            <Button icon={<PlusOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Selected Image">
                        <Image src={previewImg ? previewImg : 'https://firebasestorage.googleapis.com/v0/b/vam3d-15169.appspot.com/o/logo%2Flogoglx.svg?alt=media&token=496963e3-c862-4a5b-bd84-506ab09352ac'} />
                    </Form.Item>
                </Form>
                <Button style={{ border: "none" }} ></Button>
            </Modal>
        </>
    );
}

export default Categories;