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
import Categories from '../Categories/Categories';
const { Column } = Table;

function Movie(props) {

    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [previewImg, setPreviewImg] = useState(null);
    const [imgUpload, setImgUpload] = useState(null);
    const movieCollectionRef = collection(db, "Movie");
    const [movie, setMovie] = useState([]);
    const [update, setUpdate] = useState(false);

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

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
        form.resetFields(); // Reset the form fields when the modal is closed
        setPreviewImg(null);
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
        try {
            const values = await form.validateFields();
            const storageRef = ref(storage, `movieImages/${uuidv4()}`);
            await uploadBytes(storageRef, imgUpload);
            const movieImgURL = await getDownloadURL(storageRef);
            await addDoc(collection(db, 'Movie'), {
                nameMovie: values.nameMovie,
                imgMovie: movieImgURL,
                catergory: Categories.name,
                durationMovie: values.durationMovie,
                vipMovie: values.vipMovie,
                describe: values.describeMovie,
                protagonist: values.protagonistMovie,
                link: values.linkfilmMovie,
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
                        <Button type="primary" 
                        // onClick={showModal} 
                        icon={<PlusOutlined />} style={{ width: '100%' }}>
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
                            <Image width={50} src={record.img} />
                        )}
                    />
                    <Column title="Name Movie" dataIndex="Name" key="nameMovie" />
                    <Column title="Category" dataIndex="Category" key="nameMovie" />
                    <Column title="Duration" dataIndex="Duration" key="durationMovie" />
                    <Column title="VIP" dataIndex="VIP" key="vipMovie" />
                    <Column title="Describe" dataIndex="Describe" key="describeMovie" />
                    <Column title="Protagonist" dataIndex="Protagonis" key="protagonistMovie" />
                    <Column title="Link Film" dataIndex="Link" key="linkMovie" />
                    <Column
                        title="Action"
                        key="action"
                        render={(text, record) => (
                            <Space size="middle">
                                <Button type="primary" ><EditOutlined /></Button>
                                <Button style={{ backgroundColor: '#ff4d4f', borderColor: '#ff4d4f', color: "white" }} ><DeleteOutlined /></Button>
                            </Space>
                        )}
                    />
                </Table>
                <Modal
                    title="Add Movie"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    onClick={showModal}
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
                    <Button style={{ border: "none" }} ></Button>
                </Modal>
            </>
        );
    }

export default Movie;