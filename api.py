import os
import json
from fastapi import FastAPI, HTTPException
import geopandas as gpd
import pandas as pd
from sqlalchemy import create_engine
from sqlalchemy.engine import URL

app = FastAPI(
    title="NAKSHA Spatial Integration API",
    description="Inter-departmental REST API for land governance, cadastral data, and AI conflict detection.",
    version="1.0.0"
)

# Database Connection
def get_engine():
    DB_USER = os.environ.get("DB_USER", "postgres")
    DB_PASS = os.environ.get("DB_PASS", "Luwang2006@")
    DB_HOST = os.environ.get("DB_HOST", "localhost")
    DB_PORT = os.environ.get("DB_PORT", "5432")
    DB_NAME = os.environ.get("DB_NAME", "postgres")
    db_url = URL.create("postgresql", username=DB_USER, password=DB_PASS, host=DB_HOST, port=DB_PORT, database=DB_NAME)
    return create_engine(db_url)

@app.get("/")
def health_check():
    return {"status": "Active", "service": "NAKSHA GeoAPI"}

@app.get("/api/v1/cadastral-plots")
def get_cadastral_plots():
    """Returns all legal plot boundaries as GeoJSON."""
    engine = get_engine()
    try:
        gdf = gpd.read_postgis("SELECT * FROM cadastral_plots", engine, geom_col="geom")
        if gdf.crs is not None and gdf.crs.to_epsg() != 4326:
            gdf = gdf.to_crs(epsg=4326)
        return json.loads(gdf.to_json())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/conflicts")
def get_spatial_conflicts():
    """Returns AI-detected encroachments as GeoJSON."""
    engine = get_engine()
    try:
        gdf = gpd.read_postgis("SELECT * FROM spatial_conflicts", engine, geom_col="geom")
        if gdf.crs is not None and gdf.crs.to_epsg() != 4326:
            gdf = gdf.to_crs(epsg=4326)
        return json.loads(gdf.to_json())
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/revenue/{plot_id}")
def get_revenue_record(plot_id: str):
    """Returns non-spatial tax and revenue records for a specific plot ID."""
    engine = get_engine()
    try:
        query = "SELECT * FROM revenue_records WHERE plot_id = %(plot_id)s"
        df = pd.read_sql(query, engine, params={"plot_id": str(plot_id)})
        if df.empty:
            raise HTTPException(status_code=404, detail="Revenue record not found.")
        # Convert date objects to strings for JSON serialization
        df['last_assessment_date'] = df['last_assessment_date'].astype(str)
        return df.to_dict(orient="records")[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))