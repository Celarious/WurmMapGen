package be.woubuc.wurmunlimited.wurmmapgen.filegen;

import be.woubuc.wurmunlimited.wurmmapgen.Logger;
import be.woubuc.wurmunlimited.wurmmapgen.WurmMapGen;

import org.apache.commons.io.FilenameUtils;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Path;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

public class PortalFileGen {
	
	// The template IDs of all portal objects
	private static List<Integer> portalIds = Arrays.asList(
			603, 604, 605, 637, 606, 607, 732, 733, 855, // Vanilla Wurm portal items
			4002, 4003, 4004, 4010, 4011, 4015 // New portals mod
			);
	
	/**
	 * Generates a JSON file containing all portals in the database
	 * @param  filePath  The output file
	 */
	@SuppressWarnings("unchecked")
	public static void generatePortalFile(String filePath) throws IOException {
		Logger.title("Portal data");
		
		// Prepare JSON objects
		JSONObject dataObject = new JSONObject();
		JSONArray data = new JSONArray();
		
		Logger.details("Loading portals from wurmitems.db");
		try (PreparedStatement statement = createStatement();
			 ResultSet resultSet = statement.executeQuery()) {
			JSONObject portalData;
			
			while (resultSet.next()) {
				portalData = new JSONObject();
				
				portalData.put("name", resultSet.getString("NAME"));
				portalData.put("x", (int) Math.floor(resultSet.getInt("POSX") / 4));
				portalData.put("y", (int) Math.floor(resultSet.getInt("POSY") / 4));
				
				data.add(portalData);
			}
		} catch (SQLException e) {
			Logger.error("Could not load portals: " + e.getMessage());
			return;
		}
		
		dataObject.put("portals", data);
		
		// Write JSON data to file
		Logger.details("Creating " + filePath);
		FileWriter writer = new FileWriter(filePath, false);
		writer.write(dataObject.toJSONString());
		writer.close();
		
		Logger.ok(String.format("Added %d entries to file %s", data.size(), FilenameUtils.getName(filePath)));
	}
	
	/**
	 * Creates a prepared statement to load portal items from the database
	 * @return  The statement
	 */
	private static PreparedStatement createStatement() throws SQLException {
		StringBuilder query = new StringBuilder();
		
		query.append("select NAME, POSX, POSY from ITEMS where (");
		for (int i = 0; i < portalIds.size() - 1; i++) {
			query.append("TEMPLATEID = ? or ");
		}
		query.append("TEMPLATEID = ?) and CREATIONSTATE = 0");
		
		PreparedStatement statement = WurmMapGen.db.getItems().getConnection().prepareStatement(query.toString());
		for (int i = 0; i < portalIds.size(); i++) {
			statement.setInt(i + 1, portalIds.get(i));
		}
		
		return statement;
	}
}
