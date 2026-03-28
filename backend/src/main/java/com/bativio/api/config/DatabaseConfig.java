package com.bativio.api.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.net.URI;
import java.util.HashMap;
import java.util.Map;

/**
 * Parses DATABASE_URL (Railway format: postgresql://user:pass@host:port/db)
 * into Spring datasource properties.
 */
public class DatabaseConfig implements EnvironmentPostProcessor {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Override
    public void postProcessEnvironment(ConfigurableEnvironment environment, SpringApplication application) {
        String databaseUrl = environment.getProperty("DATABASE_URL");
        if (databaseUrl == null || databaseUrl.isBlank()) return;

        try {
            // postgresql://user:pass@host:port/dbname
            String cleanUrl = databaseUrl.replace("postgresql://", "pg://");
            URI uri = new URI(cleanUrl);

            String host = uri.getHost();
            int port = uri.getPort() > 0 ? uri.getPort() : 5432;
            String db = uri.getPath().substring(1); // remove leading /
            String[] userInfo = uri.getUserInfo().split(":", 2);
            String user = userInfo[0];
            String password = userInfo.length > 1 ? userInfo[1] : "";

            Map<String, Object> props = new HashMap<>();
            props.put("SPRING_DATASOURCE_URL", "jdbc:postgresql://" + host + ":" + port + "/" + db);
            props.put("PGUSER", user);
            props.put("PGPASSWORD", password);
            props.put("PGHOST", host);
            props.put("PGPORT", String.valueOf(port));
            props.put("PGDATABASE", db);

            environment.getPropertySources().addFirst(new MapPropertySource("databaseUrlParsed", props));
            log.info("Parsed DATABASE_URL -> jdbc:postgresql://{}:{}/{}", host, port, db);
        } catch (Exception e) {
            log.warn("Failed to parse DATABASE_URL: {}", e.getMessage());
        }
    }
}
