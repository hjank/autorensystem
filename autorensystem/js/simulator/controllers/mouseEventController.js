/**
 * Created by Helena on 04.03.2016.
 */



/**
 * Sets handlers for mouse events on table
 */
function setTimelineEventHandlers(simulation) {


    // detach event handlers from previous simulation

    $(document).off("mousedown", ".timeline-cell", handleMousedown);
    $(document).off("mousemove", handleMousemove);
    $(document).off("mouseup", handleMouseup);
    $(document).off("click", ":not(.timeline-cell)", handleClick);

    $(document).off("mouseenter", ".timeline-header th:not(.timeline-step-label)", handleColumnHeaderEnter);
    $(document).off("mouseleave", ".timeline-header th:not(.timeline-step-label)", handleColumnHeaderLeave);

    $(document).off("mouseenter", "td.timeline-step-label", handleStepLabelEnter);
    $(document).off("mouseleave", "td.timeline-step-label", handleStepLabelLeave);
    $(document).off("click", "td.timeline-step-label", handleStepLabelClick);

    $(document).off("click", ".popover-step-options .btn", handleStepOptionClick);
    $(document).off("mouseenter", ".popover-step-options .btn", handleAddStepMouseenter);
    $(document).off("mouseleave", ".popover-step-options .btn", handleAddStepMouseleave);

    $(document).off("click", ".popover-column-options .btn", handleColumnHeaderOptionClick);

    $(document).off("mouseover", ".timeline-cell-occupied a", hideAllParentsTooltips);
    $(document).off("click", ".timeline-cell-occupied a", handleOccupiedCellAnchorClickEvent);
    $(document).off("mouseleave", ".timeline-cell-occupied a", handleOccupiedCellAnchorLeave);

    $(document).off("click", ".popover .popover-close", hideAllPopovers);




    // re-attach event handlers for current simulation

    $(document).on("mousedown", ".timeline-cell", simulation, handleMousedown);
    $(document).on("mousemove", null, simulation, handleMousemove);
    $(document).on("mouseup", null, simulation, handleMouseup);
    $(document).on("click", ":not(.timeline-cell)", null, handleClick);

    $(document).on("mouseenter", ".timeline-header th:not(.timeline-step-label)", null, handleColumnHeaderEnter);
    $(document).on("mouseleave", ".timeline-header th:not(.timeline-step-label)", null, handleColumnHeaderLeave);

    $(document).on("mouseenter", "td.timeline-step-label", simulation, handleStepLabelEnter);
    $(document).on("mouseleave", "td.timeline-step-label", simulation, handleStepLabelLeave);
    $(document).on("click", "td.timeline-step-label", simulation, handleStepLabelClick);

    $(document).on("click", ".popover-step-options .btn", simulation, handleStepOptionClick);
    $(document).on("mouseenter", ".popover-step-options .btn", null, handleAddStepMouseenter);
    $(document).on("mouseleave", ".popover-step-options .btn", null, handleAddStepMouseleave);

    $(document).on("click", ".popover-column-options .btn", simulation, handleColumnHeaderOptionClick);

    $(document).on("mouseover", ".timeline-cell-occupied a", null, hideAllParentsTooltips);
    $(document).on("click", ".timeline-cell-occupied a", simulation, handleOccupiedCellAnchorClickEvent);
    $(document).on("mouseleave", ".timeline-cell-occupied a", simulation, handleOccupiedCellAnchorLeave);

    $(document).on("click", ".popover .popover-close", null, hideAllPopovers);

}

