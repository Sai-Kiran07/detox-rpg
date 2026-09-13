package rpg.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HistoryEntry {

    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String id;

    private String type;
    private String title;
    private String category;
    private String details;

    private Integer xpEarned;
    private Integer scoreEarned;
    private Integer ticketsEarned;
    private Integer ticketsSpent;

    private String attributeGained;

    private String timestamp;

    @ManyToOne
    private User user;
}