from psycopg2 import connect
import pandas as pd

class ActiveFires:
    """
    ActiveFires class

    Used to:
     - Copy points of active fires from a external database to complete the local database table;
     - Counting the number of points intercept with the spatial units;

    """

    def __init__(self, db_url: str):
        self._conn = connect(db_url)

    def read_spatial_units(self):
        """
        Gets the spatial units from database
        """
        self._spatial_units = {}
        sql = "SELECT dataname, as_attribute_name FROM public.spatial_units"
        cur = self._conn.cursor()
        cur.execute(sql)
        results=cur.fetchall()
        self._spatial_units=dict(results)

    def update_focuses_table(self):
        """
        Load active fire data from raw database using a SQL View resource named public.raw_active_fires
        *raw database has an independent sync task.
        """
        update = """
        INSERT INTO fires.active_fires(id, view_date, satelite, estado, municipio, diasemchuva, precipitacao, riscofogo, geom)
        SELECT id, view_date, satelite, estado, municipio, diasemchuva, precipitacao, riscofogo, geom
        FROM public.raw_active_fires
        WHERE view_date>(SELECT MAX(view_date) FROM fires.active_fires)
        """
        cur = self._conn.cursor()
        cur.execute(update)

    def statistics_processing(self):
        for spatial_unit, id in self._spatial_units.items():
            print(f'Processing {spatial_unit}:{id}...')

    def execute(self):
        self.read_spatial_units()
        #self.update_focuses_table()
        self.statistics_processing()


# local test
db='postgresql://postgres:postgres@192.168.15.49:5444/AMS'
ac = ActiveFires(db_url=db)
ac.execute()