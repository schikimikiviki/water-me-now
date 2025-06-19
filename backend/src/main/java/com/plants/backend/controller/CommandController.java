package com.plants.backend.controller;

import java.io.File;
import java.io.FileInputStream;

import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/run-command")
public class CommandController {

	@PostMapping("/download")
	public ResponseEntity<InputStreamResource> runCommandAndDownload(
	        @RequestParam("command") String command) {

	    try {
	        ProcessBuilder builder = new ProcessBuilder();
	        builder.command("bash", "-c", command);
	        Process process = builder.start();

	        int exitCode = process.waitFor();
	        if (exitCode != 0) {
	            return ResponseEntity.status(500).body(null);
	        }

	        // Path to the generated file
	        File file = new File("dump.sql");

	        if (!file.exists()) {
	            return ResponseEntity.status(404).body(null);
	        }

	        InputStreamResource resource = new InputStreamResource(new FileInputStream(file));

	        return ResponseEntity.ok()
	                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=dump.sql")
	                .contentType(MediaType.APPLICATION_OCTET_STREAM)
	                .contentLength(file.length())
	                .body(resource);

	    } catch (Exception e) {
	        return ResponseEntity.status(500).body(null);
	    }
	}

}
