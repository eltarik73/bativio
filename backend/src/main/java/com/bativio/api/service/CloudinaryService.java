package com.bativio.api.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * Uploads images to Cloudinary when CLOUDINARY_URL is configured.
 * Falls back to a placeholder URL when the env var is missing.
 */
@Service
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private final Cloudinary cloudinary;
    private final boolean configured;

    public CloudinaryService() {
        String cloudinaryUrl = System.getenv("CLOUDINARY_URL");
        if (cloudinaryUrl != null && !cloudinaryUrl.isBlank()) {
            this.cloudinary = new Cloudinary(cloudinaryUrl);
            this.configured = true;
            log.info("Cloudinary configured successfully");
        } else {
            this.cloudinary = null;
            this.configured = false;
            log.warn("CLOUDINARY_URL not set — photo uploads will use placeholder URLs");
        }
    }

    public boolean isConfigured() {
        return configured;
    }

    /**
     * Upload a file to Cloudinary and return {url, publicId}.
     * If Cloudinary is not configured, returns a placeholder.
     */
    @SuppressWarnings("unchecked")
    public UploadResult upload(MultipartFile file) throws IOException {
        return upload(file, file.getBytes());
    }

    @SuppressWarnings("unchecked")
    public UploadResult upload(MultipartFile file, byte[] bytes) throws IOException {
        if (!configured) {
            String placeholder = "https://placehold.co/800x600/C4531A/FFFFFF?text=Photo";
            return new UploadResult(placeholder, null);
        }

        Map<String, Object> result = cloudinary.uploader().upload(bytes,
                ObjectUtils.asMap(
                        "folder", "bativio/photos",
                        "resource_type", "image",
                        "transformation", "c_limit,w_1600,h_1200,q_auto,f_auto"
                ));

        String url = (String) result.get("secure_url");
        String publicId = (String) result.get("public_id");
        return new UploadResult(url, publicId);
    }

    public record UploadResult(String url, String publicId) {}
}
