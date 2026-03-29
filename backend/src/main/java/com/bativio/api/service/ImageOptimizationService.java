package com.bativio.api.service;

import net.coobird.thumbnailator.Thumbnails;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ImageOptimizationService {

    private static final Logger log = LoggerFactory.getLogger(ImageOptimizationService.class);

    private static final int THUMB_WIDTH = 400;
    private static final int THUMB_HEIGHT = 300;
    private static final int MEDIUM_WIDTH = 800;
    private static final int MEDIUM_HEIGHT = 600;
    private static final int LARGE_WIDTH = 1600;
    private static final int LARGE_HEIGHT = 1200;

    public void validateImage(MultipartFile file) {
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("L'image ne doit pas depasser 10 Mo");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit etre une image");
        }
        List<String> allowed = List.of("image/jpeg", "image/png", "image/webp", "image/heic", "image/heif");
        if (!allowed.contains(contentType)) {
            throw new IllegalArgumentException("Format non supporte. Utilisez JPG, PNG ou WebP.");
        }
    }

    /**
     * Compress and resize image to multiple variants.
     * Returns map with keys: thumb, medium, large.
     */
    public Map<String, byte[]> processImage(byte[] originalBytes) throws IOException {
        Map<String, byte[]> variants = new HashMap<>();

        variants.put("thumb", resize(originalBytes, THUMB_WIDTH, THUMB_HEIGHT, 0.75f));
        variants.put("medium", resize(originalBytes, MEDIUM_WIDTH, MEDIUM_HEIGHT, 0.80f));
        variants.put("large", resize(originalBytes, LARGE_WIDTH, LARGE_HEIGHT, 0.85f));

        log.info("Image processed: thumb={}KB, medium={}KB, large={}KB",
                variants.get("thumb").length / 1024,
                variants.get("medium").length / 1024,
                variants.get("large").length / 1024);

        return variants;
    }

    /**
     * Compress a single image to the medium size for quick optimization.
     */
    public byte[] compressForUpload(byte[] originalBytes) throws IOException {
        return resize(originalBytes, LARGE_WIDTH, LARGE_HEIGHT, 0.85f);
    }

    private byte[] resize(byte[] input, int maxWidth, int maxHeight, float quality) throws IOException {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Thumbnails.of(new ByteArrayInputStream(input))
                .size(maxWidth, maxHeight)
                .outputQuality(quality)
                .outputFormat("jpg")
                .toOutputStream(out);
        return out.toByteArray();
    }
}
