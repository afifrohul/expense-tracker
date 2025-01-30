import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import React, { useState, useEffect, useRef } from 'react';
import { MdAdd, MdDeleteForever, MdOutlineEditNote } from "react-icons/md";
import toast from 'react-hot-toast';
import { BiLoaderCircle } from 'react-icons/bi';
import Swal from 'sweetalert2';
import { formatRupiah } from './utils';

export default function Transaction({ auth, transaction, all_category }) {
    const [data, setData] = useState(transaction);
    const [showModal, setShowModal] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState(null);

    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');

    const [loadingDelete, setLoadingDelete] = useState(null);

    const handleShowModal = () => {
        setShowModal(true);
        setTimeout(() => setIsVisible(true), 50);
    }

    const handleCloseModal = () => {
        setIsVisible(false);
        setTimeout(() => {
            setShowModal(false);
            setDescription('');
            setCategory('');
            setType('');
            setAmount('');
            setDate('');
            setIsEditing(false);
            setEditData(null);
        }, 150); 
    };

    const handleDelete = async (item) => {

        setLoadingDelete(item.id);

        const { isConfirmed } = await Swal.fire({
            title: 'Konfirmasi',
            text: "Apakah Anda yakin ingin menghapus data ini?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus data',
            cancelButtonText: 'Batal'
        });
    
        if (!isConfirmed) {
                setLoadingDelete(null);
                return;
            }

    
        try {
            const response = await axios.delete(`/transaction/delete/${item.id}`);
    
            if (response.status === 201) {
                const updatedData = response.data.transaction;
    
                setData(updatedData);
    
                toast.success('Data berhasil dihapus.');
            }
        } catch (error) {
            toast.error("Gagal menghapus data!", error);
        }
    }

    const handleSave = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/transaction/create', {
                description: description,
                category: category,
                type: type,
                amount: amount,
                date: date,
            });

            if (response.status === 201) {
                const newData = response.data.transaction;
        
                // Update state
                setData(prevDatas => [
                    ...prevDatas,
                    {
                        id: newData.id,
                        description: newData.description,
                        category: newData.category,
                        type: newData.type,
                        amount: newData.amount,
                        date: newData.date,
                    }
                ]);
    
                // Close the modal after saving
                handleCloseModal(); 
                toast.success(response.data.message)
            } else {
                toast.error("There was an error", response);
            }

        } catch (error) {
            toast.error("There was an error", error);
        }
        
    };

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`/transaction/update/${editData.id}`, {
                description: description,
                category: category,
                type: type,
                amount: amount,
                date: date,
            });

            if (response.status === 201) {
                const updatedData = response.data.transaction

                setData(prevDatas => 
                    prevDatas.map(item =>
                        item.id === updatedData.id ? updatedData : item
                    )
                )

                handleCloseModal();
                toast.success(response.data.message);

            }
            
        } catch (error) {
            toast.error("Error updating field data!", error);
        }
    }

    const handleShowEditModal = (item) => {
        setIsEditing(true);
        setEditData(item);
        setDescription(item.description);
        setCategory(item.category_id);
        setType(item.type);
        setAmount(item.amount);
        setDate(item.date);
        handleShowModal();
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
        >
            <Head title="Transaksi" />
            <div className='bg-white rounded-lg border border-slate-300 p-4 text-sm'>
                <div className='flex justify-between items-center'>
                    <h1 className='font-bold text-lg my-4'>Daftar Transaksi</h1>
                        <div className='bg-blue-500 rounded px-3 py-2 text-white hover:bg-blue-600 duration-150 hover:cursor-pointer' onClick={handleShowModal}>
                            <MdAdd className='inline'/> Tambah
                        </div>
                </div>
                <hr className='mb-4'/>
                <table className=" divide-y divide-gray-200 w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" id='headIndex' className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Deskripsi
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Kategori
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Jenis
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tanggal
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nominal
                            </th>
                            <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Opsi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900" id='index'>{index + 1}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900">{ item.description.length > 25 ? item.description.substring(0, 25) + "..." : item.description}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900">{item.category.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900">
                                        <span className={`${item.type === 'expense' ? 'bg-red-600' : 'bg-green-600'} p-1 text-white text-sm rounded-md`}>{item.type}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className="text-sm text-gray-900">{item.date}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                    <div className={`text-sm ${item.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>{formatRupiah(item.amount)}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium flex gap-2 justify-center">
                                    <div className='flex gap-1'>
                                        <div className='p-2 w-fit rounded text-white bg-yellow-500 hover:bg-yellow-600 duration-150 hover:cursor-pointer' onClick={() => handleShowEditModal(item)}>
                                            <MdOutlineEditNote className='text-2xl'/>
                                        </div>
                                    </div>
                                    <div className='flex gap-1'>
                                        <div
                                            className={`p-2 w-fit rounded text-white ${
                                                loadingDelete === item.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600 hover:cursor-pointer'
                                            } duration-150`}
                                            onClick={loadingDelete === item.id ? null : () => handleDelete(item)}
                                            >
                                                <p>{loadingDelete === item.id ? (
                                                    <BiLoaderCircle className='text-2xl'/>
                                                ) : (
                                                    <MdDeleteForever className='text-2xl'/>
                                                )}</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>


            </div>
            {showModal && (
                <div className="fixed z-[999] inset-0 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        {/* Overlay */}
                        <div className={`fixed inset-0 bg-gray-500 transition-opacity ease-in-out duration-100 ${isVisible ? 'opacity-75' : 'opacity-0'}`} aria-hidden="true"></div>

                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                        {/* Modal Content */}
                        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all ease-in-out duration-100 sm:my-8 sm:align-middle sm:max-w-lg sm:w-full 
                        ${isVisible ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'}`}>
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                                            {isEditing ? "Edit Data" : "Tambah Data Baru"}
                                        </h3>
                                        <hr  className='my-4'/>
                                        <div className="mt-2">
                                            <form onSubmit={isEditing ? handleEdit : handleSave}>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2">Deskripsi</label>
                                                    <input 
                                                        type="text" 
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-500" 
                                                        placeholder="" 
                                                        value={description}
                                                        onChange={(e) => setDescription(e.target.value)}
                                                        required
                                                        autoFocus
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="category" className="block text-gray-700 text-sm font-bold mb-2">
                                                        Kategori
                                                    </label>
                                                    <select
                                                        id="category"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-green-500"
                                                        value={category}
                                                        onChange={e => setCategory(e.target.value)}
                                                    >
                                                        <option value="" disabled>Pilih Kategori</option>
                                                        {all_category.map((item) => (
                                                            <option key={item.id} value={item.id}>
                                                                {item.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label htmlFor="type" className="block text-gray-700 text-sm font-bold mb-2">
                                                        Jenis Transaksi
                                                    </label>
                                                    <select
                                                        id="type"
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-green-500"
                                                        value={type}
                                                        onChange={e => setType(e.target.value)}
                                                    >
                                                        <option value="" disabled>Pilih Jenis Transaksi</option>
                                                        <option value='income'>Pemasukan</option>
                                                        <option value='expense'>Pengeluaran</option>
                                                    </select>
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2">Nominal</label>
                                                    <input 
                                                        type="number" 
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:ring-blue-500" 
                                                        placeholder="" 
                                                        value={amount}
                                                        onChange={(e) => setAmount(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="mb-4">
                                                    <label className="block text-gray-700 text-sm font-bold mb-2">Tanggal</label>
                                                    <input 
                                                        type="date" 
                                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"  
                                                        value={date}
                                                        onChange={(e) => setDate(e.target.value)}
                                                    />
                                                </div>
                                                <div className="sm:flex sm:flex-row-reverse">
                                                    <button
                                                        type="submit"
                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                    >
                                                        {isEditing ? 'Update' : 'Simpan'}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                        onClick={handleCloseModal}
                                                    >
                                                        Batal
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
            )}

        </AuthenticatedLayout>
    );
}
