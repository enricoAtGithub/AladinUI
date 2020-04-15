export const ContextMenuSettings = {
    icons: {
        edit: 'pi pi-pencil',
        delete: 'pi pi-trash'
    },
    iconText: {
        edit: 'bearbeiten',
        delete: 'löschen'
    }
};

export const EventSchedulerSettings = {
    initialView: 'TimelineWorkWeek',
};

export const ResourceSchedulerSettings = {
    initialView: 'TimelineDay',
    filterText: {
        assigned: 'eingeteilt',
        available: 'verfügbar',
        hasConflict: 'indisponibel'
    },
    icons: {
        assign: 'pi pi-user-plus',
        unassign: 'pi pi-user-minus',
        hasConflict: 'pi pi-exclamation-triangle'
    },
    iconText: {
        assign: 'einteilen',
        unassign: 'Zuordnung lösen',
        hasConflict: 'Konflikt'
    }
};

export const AvailabiltySchedulerSettings = {
    initialView: 'TimelineMonth',
};
