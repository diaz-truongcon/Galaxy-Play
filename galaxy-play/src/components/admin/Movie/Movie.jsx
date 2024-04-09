import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Col, Space, Image, Row, message, Select } from 'antd';
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
import Categories from '../Categories/Categories';
import { vip } from './vip';
const { Column } = Table;
const { Option } = Select;

function Movie(props) {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);
    const [imgUpload, setImgUpload] = useState(null);
    const movieCollectionRef = collection(db, "Movie");
    const [movie, setMovie] = useState([]);
    const [update, setUpdate] = useState(false);
    const categoriesCollectionRef = collection(db, "Categories");
    const [categories, setCategories] = useState([]);
    const [movieEdit, setMovieEdit] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(movieCollectionRef);
            const movieData = [];
            querySnapshot.forEach((doc) => {
                movieData.push({ id: doc.id, ...doc.data() });
            });
            setMovie(movieData);
        };
        fetchData();
    }, [update]);

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
    console.log(categories);
    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        form.resetFields(); // Reset the form fields when the modal is closed
        setPreviewImg(null);
        setMovieEdit(null);
    };
    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Confirm Delete',
            content: 'Are you sure you want to delete this movie?',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            async onOk() {
                try {
                    const filename = record.imgMovie.split('%2F').pop().split('?').shift();

                    // Delete document from Firestore
                    await deleteDoc(doc(movieCollectionRef, record.id));

                    // Create a reference to the file to delete
                    const desertRef = ref(storage, `movieImages/${filename}`);

                    // Delete the file from storage
                    await deleteObject(desertRef);

                    // Update the state to trigger a re-render
                    setUpdate((prevUpdate) => !prevUpdate);
                } catch (error) {
                    console.error('Error deleting movie:', error);
                    // Handle error gracefully, show a notification, or log the error as needed
                }
            },
        });
    }

    const handleEdit = async (record) => {
        form.setFieldsValue({
            nameMovie: record.nameMovie,
            categoryId: record.categoryId,
            durationMovie: record.durationMovie,
            vipMovie: record.vipMovie,
            describeMovie: record.describeMovie,
            protagonistMovie: record.protagonistMovie,
            linkMovie: record.linkMovie,
        })
        setPreviewImg(record.imgMovie);
        setMovieEdit(record);
        setVisible(true);
    }

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
        try {
            const values = await form.validateFields();
            const storageRef = ref(storage, `movieImages/${uuidv4()}`);
            await uploadBytes(storageRef, imgUpload);
            const movieImgURL = await getDownloadURL(storageRef);
            await addDoc(collection(db, 'Movie'), {
                nameMovie: values.nameMovie,
                imgMovie: movieImgURL,
                categoryId: values.categoryId,
                durationMovie: values.durationMovie,
                vipMovie: values.vipMovie,
                describeMovie: values.describeMovie,
                protagonistMovie: values.protagonistMovie,
                linkMovie: values.linkMovie,
            });
            setUpdate(!update);
            message.success('Movie added successfully!');
            handleCancel();
        } catch (error) {
            console.error('Error adding film:', error);
            message.error('Failed to add film. Please try again.');
        }
    }

    return (
        <>
            <Row gutter={16} align="middle">
                <Col xs={24} md={6} xl={6} style={{ marginTop: "1em" }}>
                    <h3>List Movies</h3>
                </Col>
                <Col xs={24} md={12} xl={12} style={{ marginTop: "1em" }}>
                    <Input.Search
                        placeholder="Search movie"
                        style={{ width: '100%' }}
                        prefix={<SearchOutlined />}
                    />
                </Col>
                <Col xs={24} md={6} xl={6} style={{ marginTop: "1em" }}>
                    <Button type="primary" onClick={() => showModal(true)} icon={<PlusOutlined />} style={{ width: '100%' }}>
                        Add Movie
                    </Button>
                </Col>
            </Row>
            <Table dataSource={movie} pagination={{ pageSize: 5 }} style={{ marginTop: "1rem" }} className="responsive-table">
                <Column title="#" render={(text, record, index) => index + 1} key="index" />
                <Column
                    title="Img Movie"
                    key="imgMovie"
                    render={(text, record) => (
                        <Image width={50} src={record.imgMovie} />
                    )}
                />
                <Column title="Name Movie" dataIndex="nameMovie" />
                <Column title="Category"
                    render={(text, record) => {
                        const category = categories.find(element => element.id == record.categoryId)
                        return category ? category.nameCategory : "";
                    }}
                />
                <Column title="Duration" dataIndex="durationMovie" />
                <Column title="VIP"
                    render={(text, record) => {
                        const vipMovie = vip.find(element => element.id == record.id)
                        return vipMovie ? vipMovie.name : "";
                    }}
                />
                <Column title="Describe" dataIndex="describeMovie" />
                <Column title="Protagonist" dataIndex="protagonistMovie" />
                <Column title="Link Film" dataIndex="linkMovie" />
                <Column
                    title="Action"
                    key="action"
                    render={(text, record) => (
                        <Space size="middle">
                            <Button onClick={() => handleEdit(record)} type="primary"><EditOutlined /></Button>
                            <Button onClick={() => handleDelete(record)} style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: "white" }} ><DeleteOutlined /></Button>
                        </Space>
                    )}
                />
            </Table>
            <Modal
                title={movieEdit ? "Edit Movie" : "Add Movie"}
                visible={visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <Form.Item
                        label="Name Movie"
                        name="nameMovie"
                        rules={[{ required: true, message: 'Please enter the name of the film!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Category"
                        name="categoryId"
                        rules={[{ required: true, message: 'Please choose the category of the film!' }]}
                    >
                        <Select>
                            {categories.map(category => (
                                <Option key={category.id} value={category.id}>
                                    {category.nameCategory}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Duration"
                        name="durationMovie"
                        rules={[{ required: true, message: 'Please enter the duration of the film!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="VIP"
                        name="vipMovie"
                        rules={[{ required: true, message: 'Please choose the vip of the film!' }]}
                    >
                        <Select>
                            {vip.map(vipMovie => (
                                <Option key={vipMovie.id} value={vipMovie.id}>
                                    {vipMovie.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Describe"
                        name="describeMovie"
                        rules={[{ required: true, message: 'Please enter the describe of the film!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Protagonist"
                        name="protagonistMovie"
                        rules={[{ required: true, message: 'Please enter the protagonist of the film!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Link Film"
                        name="linkMovie"
                        rules={[{ required: true, message: 'Please enter the url of the film!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Image Moive"
                        name="imgMoive"
                        rules={[{ required: true, message: 'Please upload an image for the film!' }]}
                    >
                        <Upload {...uploadProps}>
                            <Button icon={<PlusOutlined />}>Upload Image</Button>
                        </Upload>
                    </Form.Item>
                    <Form.Item label="Selected Image">
                        <Image src={previewImg ? previewImg : 'https://firebasestorage.googleapis.com/v0/b/vam3d-15169.appspot.com/o/logo%2Flogoglx.svg?alt=media&token=496963e3-c862-4a5b-bd84-506ab09352ac'} />
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}

export default Movie;