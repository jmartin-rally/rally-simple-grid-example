var objectRenderer = function(value) {
    if ( value ) {
        return value._refObjectName;
    } else { 
        return "None";
    }
}

Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    items: [ { xtype: 'container', itemId: 'grid_box' }],
    launch: function() {
        this._getTasks();
    },
    _getTasks: function() {
        var store = Ext.create('Rally.data.WsapiDataStore',{
            model: 'Task',
            autoLoad: true,
            listeners: {
                load: function(store,data,success){
                    // remove items that aren't attached to defects
                    Ext.Array.each( data, function(item){
                        if ( item.get('WorkProduct')._type !== "Defect" ) {
                            store.remove(item);
                        }
                    });
                    this._showGrid(store);
                },
                scope: this
            }
        });
    },
    _showGrid: function(store) {
        if ( ! this.grid ) {
            this.grid = Ext.create('Rally.ui.grid.Grid',{
                store: store,
                columnCfgs: [ 
                    { text: 'ID', dataIndex: 'FormattedID' }, 
                    {text: 'Name', dataIndex: 'Name', flex: 1},
                    {text: 'Owner', dataIndex: 'Owner', renderer: objectRenderer },
                    {text: 'Project', dataIndex: 'Project', renderer: objectRenderer },
                    {text: 'Parent', dataIndex: 'WorkProduct', renderer: objectRenderer } ]
            });
            this.down('#grid_box').add(this.grid);
        }
    }
});
