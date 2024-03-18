import PropTypes from 'prop-types';

import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export function DeleteModal({
  showModal,
  setShowModal,
  handleDelete,
  whatToDelete,
}) {
  return (
    <Modal show={showModal} onClose={() => setShowModal(false)} popup size="md">
      <Modal.Header />
      <Modal.Body>
        <div className="text-center">
          <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
            Are you sure you want to delete this {whatToDelete}?
          </h3>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDelete}>
              Yes
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

// Prop types validation
DeleteModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  setShowModal: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  whatToDelete: PropTypes.string.isRequired,
};
