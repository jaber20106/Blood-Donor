import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  HStack,
  IconButton,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const DataTable = ({
  data = [],
  columns = [],
  onEdit,
  onDelete,
  emptyMessage = 'No data available',
  loading = false,
}) => {

  const handleEdit = (item) => {
    if (onEdit) onEdit(item);
  };

  const handleDelete = (item) => {
    if (onDelete) {
      onDelete(item);
    }
  };

  if (loading) {
    return (
      <Box bg="white" p={8} textAlign="center" borderRadius="md" boxShadow="sm">
        <Text color="gray.500">Loading...</Text>
      </Box>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Box bg="white" p={8} textAlign="center" borderRadius="md" boxShadow="sm">
        <Text color="gray.500">{emptyMessage}</Text>
      </Box>
    );
  }

  return (
    <Box bg="white" borderRadius="md" boxShadow="sm" overflowX="auto">
      <Table variant="simple">
        <Thead bg="gray.50">
          <Tr>
            {columns.map((col, index) => (
              <Th key={index}>{col.header}</Th>
            ))}
            {(onEdit || onDelete) && <Th>Actions</Th>}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item, index) => (
            <Tr key={item.id || index} _hover={{ bg: 'gray.50' }}>
              {columns.map((col, colIndex) => (
                <Td key={colIndex}>
                  {col.render ? col.render(item) : item[col.accessor]}
                </Td>
              ))}
              {(onEdit || onDelete) && (
                <Td>
                  <HStack spacing={2}>
                    {onEdit && (
                      <IconButton
                        icon={<FiEdit2 />}
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(item)}
                        aria-label="Edit"
                      />
                    )}
                    {onDelete && (
                      <IconButton
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDelete(item)}
                        aria-label="Delete"
                      />
                    )}
                  </HStack>
                </Td>
              )}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default DataTable;
