package br.edu.ufersa.digitalist.api.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDate;

public record ItemDTO(
        @Null(message = "ID must be null for new items")
        String id,

        @NotNull(message = "Item name is required")
        @Size(min = 3, max = 15, message = "Item name must be between 3 and 15 characters")
        String itemName,

        @NotNull(message = "Category is required")
        String category,

        @NotNull(message = "Quantity is required")
        @Positive(message = "Quantity must be greater than zero")
        Integer quantity,

        String description,

        @NotNull(message = "AddedBy field is required")
        String addedBy,

        @NotNull(message = "Image URL is required")
        String imageUrl,

        LocalDate addedDate
) {}