# use geopandas to edit large geojason file and pull out houston data
#
# read 48.geojson
import geopandas;
path_to_data = geopandas.datasets.get_path("48.geojson")
texas_df = geopandas.read_file(path_to_data)

texas_df