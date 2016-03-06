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

    $(document).off("mouseenter", ".timeline-header th:not(.timeline-step-label)", handleColumnHeaderEnter);
    $(document).off("mouseleave", ".timeline-header th:not(.timeline-step-label)", handleColumnHeaderLeave);

    $(document).off("click", "td.timeline-step-label", handleLabelClick);
    $(document).off("click", ".timeline-cell-occupied a", handleOccupiedCellAnchorClickEvent);
    $(document).off("click", ".popover-column-options .btn", handleColumnHeaderOptionClick);

    $(document).off("click", ".popover .popover-close", hideAllPopovers);


    // re-attach event handlers for current simulation
    $(document).on("mousedown", ".timeline-cell", simulation, handleMousedown);
    $(document).on("mousemove", handleMousemove);
    $(document).on("mouseup", null, simulation, handleMouseup);

    $(document).on("mouseenter", ".timeline-header th:not(.timeline-step-label)", null, handleColumnHeaderEnter);
    $(document).on("mouseleave", ".timeline-header th:not(.timeline-step-label)", null, handleColumnHeaderLeave);

    $(document).on("click", "td.timeline-step-label", simulation, handleLabelClick);
    $(document).on("click", ".timeline-cell-occupied a", simulation, handleOccupiedCellAnchorClickEvent);
    $(document).on("click", ".popover-column-options .btn", simulation, handleColumnHeaderOptionClick);

    $(document).on("click", ".popover .popover-close", null, hideAllPopovers);

}