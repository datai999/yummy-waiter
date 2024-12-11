// import React, { useState } from 'react';

// import {
//   FaCheckCircle,
//   FaClock,
//   FaGripVertical,
//   FaTasks,
// } from 'react-icons/fa';

// import {
//   closestCenter,
//   DndContext,
//   DragOverlay,
//   KeyboardSensor,
//   PointerSensor,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   arrayMove,
//   SortableContext,
//   sortableKeyboardCoordinates,
//   useSortable,
//   verticalListSortingStrategy,
// } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import {
//   Box,
//   Container,
//   IconButton,
//   Paper,
//   Typography,
// } from '@mui/material';
// import { styled } from '@mui/system';

// const StyledSection = styled(Paper)(({ theme }) => ({
//     padding: theme.spacing(2),
//     marginBottom: theme.spacing(2),
//     backgroundColor: "#f5f5f5",
//     minHeight: "200px"
// }));

// const StyledItem = styled(Paper)(({ isDragging }) => ({
//     padding: "16px",
//     marginBottom: "8px",
//     display: "flex",
//     alignItems: "center",
//     backgroundColor: isDragging ? "#e3f2fd" : "#ffffff",
//     cursor: "grab",
//     "&:hover": {
//         backgroundColor: "#f5f5f5"
//     }
// }));

// const SortableItem = ({ id, item }) => {
//     const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//     const style = {
//         transform: CSS.Transform.toString(transform),
//         transition
//     };

//     return (
//         <StyledItem ref={setNodeRef} style={style} {...attributes}>
//             <IconButton size="small" {...listeners}>
//                 <FaGripVertical />
//             </IconButton>
//             <Box ml={2} flexGrow={1}>
//                 <Typography variant="subtitle1">{item.title}</Typography>
//                 <Typography variant="body2" color="textSecondary">
//                     {item.description}
//                 </Typography>
//             </Box>
//             {item.icon === "task" && <FaTasks />}
//             {item.icon === "complete" && <FaCheckCircle />}
//             {item.icon === "pending" && <FaClock />}
//         </StyledItem>
//     );
// };

// const DraggableList = () => {
//     const [sections, setSections] = useState({
//         todo: [
//             { id: "1", title: "Complete Project", description: "Finish the main tasks", icon: "task" },
//             { id: "2", title: "Review Code", description: "Review pull requests", icon: "pending" }
//         ],
//         inProgress: [
//             { id: "3", title: "Testing", description: "Run unit tests", icon: "task" },
//             { id: "4", title: "Documentation", description: "Update docs", icon: "pending" }
//         ],
//         completed: [
//             { id: "5", title: "Setup", description: "Initial project setup", icon: "complete" },
//             { id: "6", title: "Planning", description: "Project planning phase", icon: "complete" }
//         ]
//     });

//     const [activeId, setActiveId] = useState(null);

//     const sensors = useSensors(
//         useSensor(PointerSensor),
//         useSensor(KeyboardSensor, {
//             coordinateGetter: sortableKeyboardCoordinates
//         })
//     );

//     const handleDragStart = (event) => {
//         setActiveId(event.active.id);
//     };

//     const handleDragEnd = (event) => {
//         const { active, over } = event;

//         if (!over) {
//             setActiveId(null);
//             return;
//         }

//         const sourceSection = Object.keys(sections).find((sectionKey) =>
//             sections[sectionKey].find((item) => item.id === active.id)
//         );
//         const destinationSection = Object.keys(sections).find((sectionKey) =>
//             sections[sectionKey].find((item) => item.id === over.id)
//         );

//         if (sourceSection === destinationSection) {
//             const items = [...sections[sourceSection]];
//             const oldIndex = items.findIndex((item) => item.id === active.id);
//             const newIndex = items.findIndex((item) => item.id === over.id);

//             setSections({
//                 ...sections,
//                 [sourceSection]: arrayMove(items, oldIndex, newIndex)
//             });
//         } else if (destinationSection) {
//             const sourceItems = [...sections[sourceSection]];
//             const destinationItems = [...sections[destinationSection]];
//             const item = sourceItems.find((item) => item.id === active.id);

//             sourceItems.splice(sourceItems.findIndex((i) => i.id === active.id), 1);
//             destinationItems.push(item);

//             setSections({
//                 ...sections,
//                 [sourceSection]: sourceItems,
//                 [destinationSection]: destinationItems
//             });
//         }

//         setActiveId(null);
//     };

//     const getActiveItem = () => {
//         const sectionKey = Object.keys(sections).find((key) =>
//             sections[key].find((item) => item.id === activeId)
//         );
//         return sectionKey ? sections[sectionKey].find((item) => item.id === activeId) : null;
//     };

//     return (
//         <Container maxWidth="lg">
//             <DndContext
//                 sensors={sensors}
//                 collisionDetection={closestCenter}
//                 onDragStart={handleDragStart}
//                 onDragEnd={handleDragEnd}
//             >
//                 <Box display="grid" gridTemplateColumns={{ xs: "1fr", md: "repeat(3, 1fr)" }} gap={3} py={4}>
//                     {Object.entries(sections).map(([sectionKey, items]) => (
//                         <StyledSection key={sectionKey} elevation={2}>
//                             <Typography variant="h6" gutterBottom>
//                                 {sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}
//                             </Typography>
//                             <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
//                                 {items.map((item) => (
//                                     <SortableItem key={item.id} id={item.id} item={item} />
//                                 ))}
//                             </SortableContext>
//                             {items.length === 0 && (
//                                 <Typography variant="body2" color="textSecondary" textAlign="center" py={4}>
//                                     No items in this section
//                                 </Typography>
//                             )}
//                         </StyledSection>
//                     ))}
//                 </Box>
//                 <DragOverlay>
//                     {activeId ? (
//                         <StyledItem isDragging>
//                             <IconButton size="small">
//                                 <FaGripVertical />
//                             </IconButton>
//                             <Box ml={2} flexGrow={1}>
//                                 <Typography variant="subtitle1">{getActiveItem()?.title}</Typography>
//                                 <Typography variant="body2" color="textSecondary">
//                                     {getActiveItem()?.description}
//                                 </Typography>
//                             </Box>
//                             {getActiveItem()?.icon === "task" && <FaTasks />}
//                             {getActiveItem()?.icon === "complete" && <FaCheckCircle />}
//                             {getActiveItem()?.icon === "pending" && <FaClock />}
//                         </StyledItem>
//                     ) : null}
//                 </DragOverlay>
//             </DndContext>
//         </Container>
//     );
// };

// export default DraggableList;

import React from 'react';

const DraggableList = () => {
    return (<></>);
};

export default DraggableList;
